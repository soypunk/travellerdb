<?php

namespace AppBundle\Model;

class ExportableDeck
{

    public function getArrayExport ($withUnsavedChanges = false)
    {
        $slots = $this->getSlots();
        $agendas = $slots->getAgendas();
        $agendas_code = [];
        foreach($agendas as $agenda) {
            $agendas_code[] = $agenda->getCard()->getCode();
        }
        $array = [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'date_creation' => $this->getDateCreation()->format('c'),
            'date_update' => $this->getDateUpdate()->format('c'),
            'description_md' => $this->getDescriptionMd(),
            'user_id' => $this->getUser()->getId(),
            'faction_code' => $this->getFaction()->getCode(),
            'faction_name' => $this->getFaction()->getName(),
            'slots' => $slots->getContent(),
            'agendas' => $agendas_code,
            // agenda_code deprecated. Removed 2017-03-01
            'agenda_code' => count($agendas) ? $agendas[0]->getCard()->getCode() : null,
            'version' => $this->getVersion(),
        ];

        return $array;
    }

    public function getTextExport ()
    {
        $slots = $this->getSlots();
        return [
            'name' => $this->getName(),
            'agendas' => $slots->getAgendas(),
            'faction' => $this->getFaction(),
            'draw_deck_size' => $slots->getDrawDeck()->countCards(),
            'plot_deck_size' => $slots->getPlotDeck()->countCards(),
            'adventure_deck_size' => $slots->getAdventureDeck()->countCards(),
            'captain_deck_size' => $slots->getCaptainDeck()->countCards(),
            'included_packs' => $slots->getIncludedPacks(),
            'slots_by_type' => $slots->getSlotsByType()
        ];
    }

    public function getTtsExport()
    {
        $slots = $this->getSlots();

        $guidArray = [];
        for ($i = 1; $i <= 200; $i++) {
            array_push($guidArray, bin2hex(openssl_random_pseudo_bytes(3)));
        }

        /* $decklist_factions = $slots->getCountByFaction();
        arsort($decklist_factions);
        $factions = array_keys(array_filter($decklist_factions, function($v) {
            return $v > 0;
        })); */

        return [
            'name' => $this->getName(),
            'faction' => $this->getFaction(),
            //'factions' => $factions,
            //'included_sets' => $slots->getIncludedSets(),
            'slots_by_type' => $slots->getSlotsByType(),
            'guidArray' => $guidArray
        ];
    }

}
