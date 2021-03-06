<?php

namespace AppBundle\Helper;

use Symfony\Component\Translation\TranslatorInterface;
use AppBundle\Model\SlotCollectionProviderInterface;

class DeckValidationHelper
{

    public function __construct (AgendaHelper $agenda_helper, TranslatorInterface $translator)
    {
        $this->agenda_helper = $agenda_helper;
        $this->translator = $translator;
    }

    public function getInvalidCards ($deck)
    {
        $invalidCards = [];
        foreach($deck->getSlots() as $slot) {
            if(!$this->canIncludeCard($deck, $slot->getCard())) {
                $invalidCards[] = $slot->getCard();
            }
        }
        return $invalidCards;
    }

    public function canIncludeCard ($deck, $card)
    {
        if($card->getFaction()->getCode() === 'neutral') {
            return true;
        }
        if($card->getFaction()->getCode() === $deck->getFaction()->getCode()) {
            return true;
        }
        /*
        if($card->getIsLoyal()) {
            return false;
        }
        foreach($deck->getSlots()->getAgendas() as $slot) {
            if($this->isCardAllowedByAgenda($slot->getCard(), $card)) {
                return true;
            }
        }*/

        return false;
    }

    /**
     * @param SlotCollectionProviderInterface $deck
     * @return null|string
     */
    public function findProblem (SlotCollectionProviderInterface $deck)
    {
        $slots = $deck->getSlots();

        $expectedAdvDeckCount = 20;
        $expectedCaptDeckCount = 60;
        $expectedMinCardCount = 60;

        $advDeck = $slots->getAdventureDeck();
        $captDeck = $slots->getCaptainDeck();

        $advDeckSize = $advDeck->countCards();
        $captDeckSize = $captDeck->countCards();

        /*
        if($advDeckSize < $expectedAdvDeckCount) {
            return 'too_few_adventure_cards';
        }

        if($captDeckSize < $expectedCaptDeckCount) {
            return 'too_few_captain_cards';
        }

        if($advDeckSize > $expectedAdvDeckCount) {
            return 'too_many_adventure_cards';
        }

        if($$captDeckSize > $expectedCaptDeckCount) {
            return 'too_many_captain_cards';
        }
        */
        /*
        if($slots->getDrawDeck()->countCards() < $expectedMinCardCount) {
            return 'too_few_cards';
        }*/

        foreach($slots->getCopiesAndDeckLimit() as $cardName => $value) {
            if($value['copies'] > $value['deck_limit']) {
                return 'too_many_copies';
            }
        }

        return null;
    }

    public function getProblemLabel ($problem)
    {
        if(!$problem) {
            return null;
        }
        return $this->translator->trans('decks.problems.' . $problem);
        cosnole_log($problem);
    }

}
