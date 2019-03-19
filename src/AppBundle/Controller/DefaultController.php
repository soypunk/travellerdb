<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Model\DecklistManager;
use AppBundle\Entity\Decklist;

class DefaultController extends Controller
{

    public function indexAction()
    {
        $response = new Response();
        $response->setPublic();
        $response->setMaxAge($this->container->getParameter('cache_expiration'));

        /** 
         * @var $decklist_manager DecklistManager  
         */
        $decklist_manager = $this->get('decklist_manager');
        $decklist_manager->setLimit(1);
        
		
        $typeNames = [];
        foreach($this->getDoctrine()->getRepository('AppBundle:Type')->findAll() as $type) {
        	$typeNames[$type->getCode()] = $type->getName();
        }

        $subtypeNames = [];
        foreach($this->getDoctrine()->getRepository('AppBundle:Subtype')->findAll() as $subtype) {
            $subtypeNames[$subtype->getCode()] = $subtype->getName();
        }


        $decklists_by_faction = [];
        $factions = $this->getDoctrine()->getRepository('AppBundle:Faction')->findBy(['isPrimary' => true], ['code' => 'ASC']);
        
        foreach($factions as $faction) 
        {
            $array = [];
            $array['faction'] = $faction;

        	$decklist_manager->setFaction($faction);
        	$paginator = $decklist_manager->findDecklistsByPopularity();
			
        	/**
        	 * @var $decklist Decklist
        	 */
            $decklist = $paginator->getIterator()->current();
            
            if($decklist) 
            {
                $array['decklist'] = $decklist;

                $countByType = $decklist->getSlots()->getCountByType();
                $counts = [];
                foreach($countByType as $code => $qty) {
                    $typeName = $typeNames[$code];
                    $counts[] = $qty . " " . $typeName . "s";
                }
                $array['count_by_type'] = join(' &bull; ', $counts);

                $factions = [ $faction->getName() ];
                foreach($decklist->getSlots()->getAgendas() as $agenda) {
                    $minor_faction = $this->get('agenda_helper')->getMinorFaction($agenda->getCard());
                    if($minor_faction) {
                    	$factions[] = $minor_faction->getName();
                    } else if($agenda->getCard()->getCode() != '06018') { // prevent Alliance agenda to show up
                        $factions[] = $agenda->getCard()->getName();
                    }
                }
                $array['factions'] = join(' / ', $factions);

                $decklists_by_faction[] = $array;
            }
        }
		

        $game_name = $this->container->getParameter('game_name');
        $publisher_name = $this->container->getParameter('publisher_name');
        
        return $this->render('AppBundle:Default:index.html.twig', [
            'pagetitle' =>  "$game_name Deckbuilder",
            'pagedescription' => "Build your deck for $game_name by $publisher_name. Browse the cards and the thousand of decklists submitted by the community. Publish your own decks and get feedback.",
            'decklists_by_faction' => $decklists_by_faction
        ], $response);
    }
	
    function rulesreferenceAction()
    {
    	$response = new Response();
    	$response->setPublic();
    	$response->setMaxAge($this->container->getParameter('cache_expiration'));

    	$page = $this->renderView('AppBundle:Default:rulesreference.html.twig',
    			array("pagetitle" => $this->get("translator")->trans("nav.rules"), "pagedescription" => "Rules Reference"));
    	$response->setContent($page);
    	return $response;
    }

    function faqAction()
    {
    	$response = new Response();
    	$response->setPublic();
    	$response->setMaxAge($this->container->getParameter('cache_expiration'));

    	$page = $this->renderView('AppBundle:Default:faq.html.twig',
    			array("pagetitle" => $this->get("translator")->trans("nav.rules"), "pagedescription" => "F.A.Q"));
    	$response->setContent($page);
    	return $response;
    }

    function tournamentregulationsAction()
    {
    	$response = new Response();
    	$response->setPublic();
    	$response->setMaxAge($this->container->getParameter('cache_expiration'));

    	$page = $this->renderView('AppBundle:Default:tournamentregulations.html.twig',
    			array("pagetitle" => $this->get("translator")->trans("nav.rules"), "pagedescription" => "Tournament Regulations"));
    	$response->setContent($page);
    	return $response;
    }

    function aboutAction()
    {
    	$response = new Response();
    	$response->setPublic();
    	$response->setMaxAge($this->container->getParameter('cache_expiration'));

    	return $this->render('AppBundle:Default:about.html.twig', array(
    			"pagetitle" => "About",
    			"game_name" => $this->container->getParameter('game_name'),
    	), $response);
    }

    function ffgAction()
    {
        $response = new Response();
        $response->setPublic();
        $response->setMaxAge($this->container->getParameter('cache_expiration'));

        return $this->render('AppBundle:Default:ffg.html.twig', array(
            "pagetitle" => "Horizon Games",
            "game_name" => $this->container->getParameter('game_name'),
        ), $response);
    }

    function horizonAction()
    {
        $response = new Response();
        $response->setPublic();
        $response->setMaxAge($this->container->getParameter('cache_expiration'));

        return $this->render('AppBundle:Default:horizon.html.twig', array(
            "pagetitle" => "Horizon Games",
            "game_name" => $this->container->getParameter('game_name'),
        ), $response);
    }

    function apiIntroAction()
    {
    	$response = new Response();
    	$response->setPublic();
    	$response->setMaxAge($this->container->getParameter('cache_expiration'));

    	return $this->render('AppBundle:Default:apiIntro.html.twig', array(
    			"pagetitle" => "API",
    			"game_name" => $this->container->getParameter('game_name'),
    			"publisher_name" => $this->container->getParameter('publisher_name'),
    	), $response);
    }
	
}
