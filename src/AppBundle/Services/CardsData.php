<?php

namespace AppBundle\Services;

use Symfony\Component\HttpFoundation\RequestStack;
use Doctrine\Bundle\DoctrineBundle\Registry;
use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Symfony\Bundle\FrameworkBundle\Templating\Helper\AssetsHelper;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Translation\TranslatorInterface;

/*
 *
 */

class CardsData
{

    public function __construct (Registry $doctrine, RequestStack $request_stack, Router $router, AssetsHelper $assets_helper, TranslatorInterface $translator, $rootDir)
    {
        $this->doctrine = $doctrine;
        $this->request_stack = $request_stack;
        $this->router = $router;
        $this->assets_helper = $assets_helper;
        $this->translator = $translator;
        $this->rootDir = $rootDir;
    }

    /**
     * Searches for and replaces symbol tokens with markup in a given text.
     * @param string $text
     * @return string
     */
    public function replaceSymbols ($text)
    {
        static $displayTextReplacements = [
            '[baratheon]' => '<span class="icon-baratheon"></span>',
            '[intrigue]' => '<span class="icon-intrigue"></span>',
            '[greyjoy]' => '<span class="icon-greyjoy"></span>',
            '[lannister]' => '<span class="icon-lannister"></span>',
            '[martell]' => '<span class="icon-martell"></span>',
            '[military]' => '<span class="icon-military"></span>',
            '[thenightswatch]' => '<span class="icon-thenightswatch"></span>',
            '[power]' => '<span class="icon-power"></span>',
            '[stark]' => '<span class="icon-stark"></span>',
            '[targaryen]' => '<span class="icon-targaryen"></span>',
            '[tyrell]' => '<span class="icon-tyrell"></span>',
            '[unique]' => '<span class="icon-unique"></span>',
            '[connection]' => '<span class="icon-connection"></span>',
        ];

        return str_replace(array_keys($displayTextReplacements), array_values($displayTextReplacements), $text);
    }

    /**
     * Searches for single keywords and surround them with <abbr>
     * @param string $text
     * @return string
     */
    public function addAbbrTags ($text)
    {
        static $keywords = ['renown', 'intimidate', 'stealth', 'insight', 'limited', 'pillage', 'terminal', 'ambush', 'bestow'];

        $locale = $this->request_stack->getCurrentRequest() ? $this->request_stack->getCurrentRequest()->getLocale() : 'en';

        foreach($keywords as $keyword) {
            $translated = $this->translator->trans('keyword.' . $keyword . ".name", array(), "messages", $locale);

            $text = preg_replace_callback("/\b($translated)\b/i", function ($matches) use ($keyword) {
                return "<abbr data-keyword=\"$keyword\">" . $matches[1] . "</abbr>";
            }, $text);
        }



        return $text;
    }

    public function splitInParagraphs ($text)
    {
        if(empty($text))
            return '';
        return implode(array_map(function ($l) {
                    return "<p>$l</p>";
                }, preg_split('/[\r\n]+/', $text)));
    }

    public function allsetsdata ()
    {
        $list_cycles = $this->doctrine->getRepository('AppBundle:Cycle')->findAll();
        $lines = [];
        /* @var $cycle \AppBundle\Entity\Cycle */
        foreach($list_cycles as $cycle) {
            $packs = $cycle->getPacks();
            /* @var $pack \AppBundle\Entity\Pack */
            foreach($packs as $pack) {
                $known = count($pack->getCards());
                $max = $pack->getSize();

                if($cycle->getSize() === 1) {
                    $label = $pack->getName();
                } else {
                    $label = $pack->getPosition() . '. ' . $pack->getName();
                }
                if($known < $max) {
                    $label = sprintf("%s (%d/%d)", $label, $known, $max);
                }

                $lines[] = array(
                    "code" => $pack->getCode(),
                    "label" => $label,
                    "available" => $pack->getDateRelease() ? true : false,
                    "url" => $this->router->generate('cards_list', array('pack_code' => $pack->getCode()), UrlGeneratorInterface::ABSOLUTE_URL),
                );
            }
        }
        return $lines;
    }

    public function allsetsdatathreaded ()
    {
        $list_cycles = $this->doctrine->getRepository('AppBundle:Cycle')->findBy([], array("position" => "ASC"));
        $cycles = [];

        /* @var $cycle \AppBundle\Entity\Cycle */
        foreach($list_cycles as $cycle) {
            $list_packs = $cycle->getPacks();
            $packs = [];

            /* @var $pack \AppBundle\Entity\Pack */
            foreach($list_packs as $pack) {
                $known = count($pack->getCards());
                $max = $pack->getSize();

                $label = $pack->getName();

                if($known < $max) {
                    $label = sprintf("%s (%d/%d)", $label, $known, $max);
                }

                $packs[] = [
                    "code" => $pack->getCode(),
                    "label" => $label,
                    "available" => $pack->getDateRelease() ? true : false,
                    "url" => $this->router->generate('cards_list', array('pack_code' => $pack->getCode()), UrlGeneratorInterface::ABSOLUTE_URL),
                ];
            }

            if($cycle->getSize() === 1) {

                $cycles[] = $packs[0];
            } else {

                $cycles[] = [
                    "code" => $cycle->getCode(),
                    "label" => $cycle->getName(),
                    "packs" => $packs,
                    "url" => $this->router->generate('cards_cycle', array('cycle_code' => $cycle->getCode()), UrlGeneratorInterface::ABSOLUTE_URL),
                ];
            }
        }

        return $cycles;
    }

    public function getPrimaryFactions ()
    {
        $factions = $this->doctrine->getRepository('AppBundle:Faction')->findPrimaries();
        return $factions;
    }

    public function get_search_rows ($conditions, $sortorder, $forceempty = false)
    {
        $i = 0;

        // construction de la requete sql
        $repo = $this->doctrine->getRepository('AppBundle:Card');
        $qb = $repo->createQueryBuilder('c')
                ->select('c', 'p', 'y', 't', 'f')
                ->leftJoin('c.pack', 'p')
                ->leftJoin('p.cycle', 'y')
                ->leftJoin('c.type', 't')
                ->leftJoin('c.faction', 'f');
        $qb2 = null;
        $qb3 = null;

        foreach($conditions as $condition) {
            $searchCode = array_shift($condition);
            $searchName = \AppBundle\Controller\SearchController::$searchKeys[$searchCode];
            $searchType = \AppBundle\Controller\SearchController::$searchTypes[$searchCode];
            $operator = array_shift($condition);

            switch($searchType) {
                case 'boolean': {
                        switch($searchCode) {
                            default: {
                                    if(($operator == ':' && $condition[0]) || ($operator == '!' && !$condition[0])) {
                                        $qb->andWhere("(c.$searchName = 1)");
                                    } else {
                                        $qb->andWhere("(c.$searchName = 0)");
                                    }
                                    $i++;
                                    break;
                                }
                        }
                        break;
                    }
                case 'integer': {
                        switch($searchCode) {
                            case 'c': // cycle
                                {
                                    $or = [];
                                    foreach($condition as $arg) {
                                        switch($operator) {
                                            case ':': $or[] = "(y.position = ?$i)";
                                                break;
                                            case '!': $or[] = "(y.position != ?$i)";
                                                break;
                                        }
                                        $qb->setParameter($i++, $arg);
                                    }
                                    $qb->andWhere(implode($operator == '!' ? " and " : " or ", $or));
                                    break;
                                }
                            default: {
                                    $or = [];
                                    foreach($condition as $arg) {
                                        switch($operator) {
                                            case ':': $or[] = "(c.$searchName = ?$i)";
                                                break;
                                            case '!': $or[] = "(c.$searchName != ?$i)";
                                                break;
                                            case '<': $or[] = "(c.$searchName < ?$i)";
                                                break;
                                            case '>': $or[] = "(c.$searchName > ?$i)";
                                                break;
                                        }
                                        $qb->setParameter($i++, $arg);
                                    }
                                    $qb->andWhere(implode($operator == '!' ? " and " : " or ", $or));
                                    break;
                                }
                        }
                        break;
                    }
                case 'code': {
                        switch($searchCode) {
                            case 'e': {
                                    $or = [];
                                    foreach($condition as $arg) {
                                        switch($operator) {
                                            case ':': $or[] = "(p.code = ?$i)";
                                                break;
                                            case '!': $or[] = "(p.code != ?$i)";
                                                break;
                                            case '<':
                                                if(!isset($qb2)) {
                                                    $qb2 = $this->doctrine->getRepository('AppBundle:Pack')->createQueryBuilder('p2');
                                                    $or[] = $qb->expr()->lt('p.dateRelease', '(' . $qb2->select('p2.dateRelease')->where("p2.code = ?$i")->getDql() . ')');
                                                }
                                                break;
                                            case '>':
                                                if(!isset($qb3)) {
                                                    $qb3 = $this->doctrine->getRepository('AppBundle:Pack')->createQueryBuilder('p3');
                                                    $or[] = $qb->expr()->gt('p.dateRelease', '(' . $qb3->select('p3.dateRelease')->where("p3.code = ?$i")->getDql() . ')');
                                                }
                                                break;
                                        }
                                        $qb->setParameter($i++, $arg);
                                    }
                                    $qb->andWhere(implode($operator == '!' ? " and " : " or ", $or));
                                    break;
                                }
                            default: // type and faction
                                {
                                    $or = [];
                                    foreach($condition as $arg) {
                                        switch($operator) {
                                            case ':': $or[] = "($searchCode.code = ?$i)";
                                                break;
                                            case '!': $or[] = "($searchCode.code != ?$i)";
                                                break;
                                        }
                                        $qb->setParameter($i++, $arg);
                                    }
                                    $qb->andWhere(implode($operator == '!' ? " and " : " or ", $or));
                                    break;
                                }
                        }
                        break;
                    }
                case 'string': {
                        switch($searchCode) {
                            case '': // name or index
                                {
                                    $or = [];
                                    foreach($condition as $arg) {
                                        $code = preg_match('/^\d\d\d\d\d$/u', $arg);
                                        $acronym = preg_match('/^[A-Z]{2,}$/', $arg);
                                        if($code) {
                                            $or[] = "(c.code = ?$i)";
                                            $qb->setParameter($i++, $arg);
                                        } else if($acronym) {
                                            $or[] = "(BINARY(c.name) like ?$i)";
                                            $qb->setParameter($i++, "%$arg%");
                                            $like = implode('% ', str_split($arg));
                                            $or[] = "(REPLACE(c.name, '-', ' ') like ?$i)";
                                            $qb->setParameter($i++, "$like%");
                                        } else {
                                            $or[] = "(c.name like ?$i)";
                                            $qb->setParameter($i++, "%$arg%");
                                        }
                                    }
                                    $qb->andWhere(implode(" or ", $or));
                                    break;
                                }
                            case 'x': // text
                                {
                                    $or = [];
                                    foreach($condition as $arg) {
                                        switch($operator) {
                                            case ':': $or[] = "(c.text like ?$i)";
                                                break;
                                            case '!': $or[] = "(c.text is null or c.text not like ?$i)";
                                                break;
                                        }
                                        $qb->setParameter($i++, "%$arg%");
                                    }
                                    $qb->andWhere(implode($operator == '!' ? " and " : " or ", $or));
                                    break;
                                }
                            case 'a': // flavor
                            {
                                $or = [];
                                foreach($condition as $arg) {
                                    switch($operator) {
                                        case ':': $or[] = "(c.flavor like ?$i)";
                                            break;
                                        case '!': $or[] = "(c.flavor is null or c.flavor not like ?$i)";
                                            break;
                                    }
                                    $qb->setParameter($i++, "%$arg%");
                                }
                                $qb->andWhere(implode($operator == '!' ? " and " : " or ", $or));
                                break;
                            }
                            case 'g': // complicationname
                            {
                                $or = [];
                                foreach($condition as $arg) {
                                    switch($operator) {
                                        case ':': $or[] = "(c.complicationname like ?$i)";
                                            break;
                                        case '!': $or[] = "(c.complicationname is null or c.complicationname not like ?$i)";
                                            break;
                                    }
                                    $qb->setParameter($i++, "%$arg%");
                                }
                                $qb->andWhere(implode($operator == '!' ? " and " : " or ", $or));
                                break;
                            }
                            case 'k': // subtype (traits)
                                {
                                    $or = [];
                                    foreach($condition as $arg) {
                                        switch($operator) {
                                            case ':':
                                                $or[] = "((c.traits = ?$i) or (c.traits like ?" . ($i + 1) . ") or (c.traits like ?" . ($i + 2) . ") or (c.traits like ?" . ($i + 3) . "))";
                                                $qb->setParameter($i++, "$arg.");
                                                $qb->setParameter($i++, "$arg. %");
                                                $qb->setParameter($i++, "%. $arg.");
                                                $qb->setParameter($i++, "%. $arg. %");
                                                break;
                                            case '!':
                                                $or[] = "(c.traits is null or ((c.traits != ?$i) and (c.traits not like ?" . ($i + 1) . ") and (c.traits not like ?" . ($i + 2) . ") and (c.traits not like ?" . ($i + 3) . ")))";
                                                $qb->setParameter($i++, "$arg.");
                                                $qb->setParameter($i++, "$arg. %");
                                                $qb->setParameter($i++, "%. $arg.");
                                                $qb->setParameter($i++, "%. $arg. %");
                                                break;
                                        }
                                    }
                                    $qb->andWhere(implode($operator == '!' ? " and " : " or ", $or));
                                    break;
                                }
                            case 'i': // illustrator
                                {
                                    $or = [];
                                    foreach($condition as $arg) {
                                        switch($operator) {
                                            case ':': $or[] = "(c.illustrator = ?$i)";
                                                break;
                                            case '!': $or[] = "(c.illustrator != ?$i)";
                                                break;
                                        }
                                        $qb->setParameter($i++, $arg);
                                    }
                                    $qb->andWhere(implode($operator == '!' ? " and " : " or ", $or));
                                    break;
                                }
                            case 'r': // release
                                {
                                    $or = [];
                                    foreach($condition as $arg) {
                                        switch($operator) {
                                            case '<': $or[] = "(p.dateRelease <= ?$i)";
                                                break;
                                            case '>': $or[] = "(p.dateRelease > ?$i or p.dateRelease IS NULL)";
                                                break;
                                        }
                                        if($arg == "now")
                                            $qb->setParameter($i++, new \DateTime());
                                        else
                                            $qb->setParameter($i++, new \DateTime($arg));
                                    }
                                    $qb->andWhere(implode(" or ", $or));
                                    break;
                                }
                        }
                        break;
                    }
            }
        }

        if(!$i && !$forceempty) {
            return;
        }
        switch($sortorder) {
            case 'set': $qb->orderBy('y.position')->addOrderBy('p.position')->addOrderBy('c.position');
                break;
            case 'faction': $qb->orderBy('c.faction')->addOrderBy('c.type');
                break;
            case 'type': $qb->orderBy('c.type')->addOrderBy('c.faction');
                break;
            case 'cost': $qb->orderBy('c.type')->addOrderBy('c.cost')->addOrderBy('c.name');
                break;
            case 'expense': $qb->orderBy('c.type')->addOrderBy('c.expense')->addOrderBy('c.cost');
                break;
        }
        $qb->addOrderBy('c.name');
        $qb->addOrderBy('c.code');
        $rows = $repo->getResult($qb);

        return $rows;
    }

    /**
     *
     * @param \AppBundle\Entity\Card $card
     * @param string $api
     * @return multitype:multitype: string number mixed NULL unknown
     */
    public function getCardInfo ($card, $api = false)
    {
        $cardinfo = [];

        $metadata = $this->doctrine->getManager()->getClassMetadata('AppBundle:Card');
        $fieldNames = $metadata->getFieldNames();
        $associationMappings = $metadata->getAssociationMappings();

        foreach($associationMappings as $fieldName => $associationMapping) {
            if($associationMapping['isOwningSide']) {
                $getter = str_replace(' ', '', ucwords(str_replace('_', ' ', "get_$fieldName")));
                $associationEntity = $card->$getter();
                if(!$associationEntity)
                    continue;

                $cardinfo[$fieldName . '_code'] = $associationEntity->getCode();
                $cardinfo[$fieldName . '_name'] = $associationEntity->getName();
            }
        }

        foreach($fieldNames as $fieldName) {
            $getter = str_replace(' ', '', ucwords(str_replace('_', ' ', "get_$fieldName")));
            $value = $card->$getter();
            switch($metadata->getTypeOfField($fieldName)) {
                case 'datetime':
                case 'date':
                    continue 2;
                    break;
                case 'boolean':
                    $value = (boolean) $value;
                    break;
            }
            $fieldName = ltrim(strtolower(preg_replace('/[A-Z]/', '_$0', $fieldName)), '_');
            $cardinfo[$fieldName] = $value;
        }

        $cardinfo['url'] = $this->router->generate('cards_zoom', array('card_code' => $card->getCode()), UrlGeneratorInterface::ABSOLUTE_URL);
        $imageurl = $this->assets_helper->getUrl('bundles/cards/' . $card->getCode() . '.png');
        $imagepath = $this->rootDir . '/../web' . preg_replace('/\?.*/', '', $imageurl);
        if(file_exists($imagepath)) {
            $cardinfo['imagesrc'] = $imageurl;
        } else {
            $cardinfo['imagesrc'] = null;
        }

        // look for another card with the same name to set the label
        $homonyms = $this->doctrine->getRepository('AppBundle:Card')->findBy(['name' => $card->getName()]);
        if(count($homonyms) > 1) {
            $cardinfo['label'] = $card->getName() . ' (' . $card->getPack()->getCode() . ')';
        } else {
            $cardinfo['label'] = $card->getName();
        }

        if($api) {
            unset($cardinfo['id']);
            $cardinfo['ci'] = $card->getCost();
            $cardinfo['si'] = $card->getExpense();
        } else {
            $cardinfo['text'] = $this->replaceSymbols($cardinfo['text']);
            $cardinfo['text'] = $this->addAbbrTags($cardinfo['text']);
            $cardinfo['text'] = $this->splitInParagraphs($cardinfo['text']);

            $cardinfo['flavor'] = $this->replaceSymbols($cardinfo['flavor']);
        }

        return $cardinfo;
    }

    public function syntax ($query)
    {
        // renvoie une liste de conditions (array)
        // chaque condition est un tableau à n>1 éléments
        // le premier est le type de condition (0 ou 1 caractère)
        // les suivants sont les arguments, en OR

        $query = preg_replace('/\s+/u', ' ', trim($query));

        $list = [];
        $cond = null;
        // l'automate a 3 états :
        // 1:recherche de type
        // 2:recherche d'argument principal
        // 3:recherche d'argument supplémentaire
        // 4:erreur de parsing, on recherche la prochaine condition
        // s'il tombe sur un argument alors qu'il est en recherche de type, alors le type est vide
        $etat = 1;
        while($query != "") {
            if($etat == 1) {
                if(isset($cond) && $etat != 4 && count($cond) > 2) {
                    $list[] = $cond;
                }
                // on commence par rechercher un type de condition
                $match = [];
                if(preg_match('/^(\p{L})([:<>!])(.*)/u', $query, $match)) { // jeton "condition:"
                    $cond = array(mb_strtolower($match[1]), $match[2]);
                    $query = $match[3];
                } else {
                    $cond = array("", ":");
                }
                $etat = 2;
            } else {
                if(preg_match('/^"([^"]*)"(.*)/u', $query, $match) // jeton "texte libre entre guillements"
                        || preg_match('/^([\p{L}\p{N}\-\&]+)(.*)/u', $query, $match) // jeton "texte autorisé sans guillements"
                ) {
                    if(($etat == 2 && count($cond) == 2) || $etat == 3) {
                        $cond[] = $match[1];
                        $query = $match[2];
                        $etat = 2;
                    } else {
                        // erreur
                        $query = $match[2];
                        $etat = 4;
                    }
                } else if(preg_match('/^\|(.*)/u', $query, $match)) { // jeton "|"
                    if(($cond[1] == ':' || $cond[1] == '!') && (($etat == 2 && count($cond) > 2) || $etat == 3)) {
                        $query = $match[1];
                        $etat = 3;
                    } else {
                        // erreur
                        $query = $match[1];
                        $etat = 4;
                    }
                } else if(preg_match('/^ (.*)/u', $query, $match)) { // jeton " "
                    $query = $match[1];
                    $etat = 1;
                } else {
                    // erreur
                    $query = substr($query, 1);
                    $etat = 4;
                }
            }
        }
        if(isset($cond) && $etat != 4 && count($cond) > 2) {
            $list[] = $cond;
        }
        return $list;
    }

    public function validateConditions ($conditions)
    {
        // suppression des conditions invalides
        $numeric = array('<', '>');

        foreach($conditions as $i => $l) {
            $searchCode = $l[0];
            $searchOp = $l[1];

            if(in_array($searchOp, $numeric) && \AppBundle\Controller\SearchController::$searchTypes[$searchCode] !== 'integer') {
                // operator is numeric but searched property is not
                unset($conditions[$i]);
            }
        }

        return array_values($conditions);
    }

    public function buildQueryFromConditions ($conditions)
    {
        // reconstruction de la bonne chaine de recherche pour affichage
        return implode(" ", array_map(
                        function ($l) {
                    return ($l[0] ? $l[0] . $l[1] : "")
                            . implode("|", array_map(
                                            function ($s) {
                                        return preg_match("/^[\p{L}\p{N}\-\&]+$/u", $s) ? $s : "\"$s\"";
                                    }, array_slice($l, 2)
                    ));
                }, $conditions
        ));
    }

    public function get_reviews ($card)
    {
        $reviews = $this->doctrine->getRepository('AppBundle:Review')->findBy(array('card' => $card), array('nbVotes' => 'DESC'));

        $response = $reviews;

        return $response;
    }

    public function getDistinctTraits ()
    {
        /**
         * @var $em \Doctrine\ORM\EntityManager
         */
        $em = $this->doctrine->getManager();
        $qb = $em->createQueryBuilder();
        $qb->from('AppBundle:Card', 'c');
        $qb->select('c.traits');
        $qb->distinct();
        $result = $qb->getQuery()->getResult();

        $traits = [];
        foreach($result as $card) {
            $subs = explode('.', $card["traits"]);
            foreach($subs as $sub) {
                $traits[trim($sub)] = 1;
            }
        }
    }

}
