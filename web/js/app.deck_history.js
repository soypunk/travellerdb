(function app_deck_history(deck_history, $)
{

    var tbody,
            clock,
            snapshots_init = [],
            snapshots = [],
            progressbar,
            timer,
            ajax_in_process = false,
            period = 60,
            changed_since_last_autosave = false;


    /**
     * @memberOf deck_history
     */
    deck_history.all_changes = function all_changes() {
        //console.log("ch ch changes", app.deck.get_content());
        if (snapshots.length <= 0) {
            //console.log("boo");
            return;
        }

        // compute diff between last snapshot and current deck
        var last_snapshot = deck_history.base.content;
        var current_deck = app.deck.get_content();

        var result = app.diff.compute_simple([current_deck, last_snapshot]);
        if (!result) return;

        var diff = result[0];
        //console.log("DIFFF ", diff);


        var cards_removed = [];
        var cards_added = [];
        _.each(diff[1], function (qty, code) {
            var card = app.data.cards.findById(code);
            if (!card) return;
            var card_change = {
                "qty": qty,
                "code": code,
                "card": card
            };
            cards_removed.push(card_change);
        });

        _.each(diff[0], function (qty, code) {
            var card = app.data.cards.findById(code);
            if (!card) return;
            var card_change = {
                "qty": qty,
                "code": code,
                "card": card
            };
            cards_added.push(card_change);
        });

        // first check for same named cards
        _.each(cards_added, function (addition) {
            _.each(cards_removed, function (removal) {
                if (addition.qty > 0 && removal.qty > 0 && addition.card.xp >= 0 && addition.card.name == removal.card.name && addition.card.xp > removal.card.xp) {
                    addition.qty = addition.qty - removal.qty;
                    cost = cost + ((addition.card.xp - removal.card.xp) * removal.qty);
                    removal.qty = Math.abs(addition.qty);
                }
                if (removal.card.xp === 0) {
                    removed_0_cards += removal.qty;
                }
            });
        });

        var add_list = [];
        var remove_list = [];
        // run through the changes and show them
        _.each(diff[0], function (qty, code) {
            var card = app.data.cards.findById(code);
            if (!card) return;
            add_list.push('+' + qty + ' ' + '<a href="' + card.url + '" class="card card-tip fg-' + card.faction_code + '" data-toggle="modal" data-remote="false" data-target="#cardModal" data-code="' + card.code + '">' + card.name + '</a>' + app.format.xp(card.xp) + '</a>');
            //add_list.push('+'+qty+' '+'<a href="'+Routing.generate('cards_zoom',{card_code:code})+'" class="card-tip" data-code="'+code+'">'+card.name+''+(card.xp >= 0 ? ' ('+card.xp+')' : '')+'</a>');
        });
        _.each(diff[1], function (qty, code) {
            var card = app.data.cards.findById(code);
            if (!card) return;
            remove_list.push('&minus;' + qty + ' ' + '<a href="' + card.url + '" class="card card-tip fg-' + card.faction_code + '" data-toggle="modal" data-remote="false" data-target="#cardModal" data-code="' + card.code + '">' + card.name + '</a>' + app.format.xp(card.xp) + '</a>');
            //remove_list.push('&minus;'+qty+' '+'<a href="'+Routing.generate('cards_zoom',{card_code:code})+'" class="card-tip" data-code="'+code+'">'+card.name+'</a>');
        });

    }


    /**
     * @memberOf deck_history
     */
    deck_history.autosave = function autosave()
    {

        // check if deck has been modified since last autosave
        if(!changed_since_last_autosave)
            return;

        // compute diff between last snapshot and current deck
        var last_snapshot = snapshots[snapshots.length - 1].content;
        var current_deck = app.deck.get_content();

        changed_since_last_autosave = false;

        var result = app.diff.compute_simple([current_deck, last_snapshot]);
        if(!result)
            return;

        var diff = result[0];
        var diff_json = JSON.stringify(diff);
        if(diff_json == '[{},{}]')
            return;

        // send diff to autosave
        $('#tab-header-history').html("Autosave...");
        ajax_in_process = true;

        $.ajax(Routing.generate('deck_autosave'), {
            data: {
                diff: diff_json,
                deck_id: app.deck.get_id()
            },
            type: 'POST',
            success: function (data, textStatus, jqXHR)
            {
                deck_history.add_snapshot({datecreation: data, variation: diff, content: current_deck, is_saved: false});
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log('[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] Error on ' + this.url, textStatus, errorThrown);
                changed_since_last_autosave = true;
            },
            complete: function ()
            {
                $('#tab-header-history').html("History");
                ajax_in_process = false;
            }
        });

    }

    /**
     * @memberOf deck_history
     */
    deck_history.autosave_interval = function autosave_interval()
    {
        // if we are in the process of an ajax autosave request, do nothing now
        if(ajax_in_process)
            return;

        // making sure we don't go into negatives
        if(timer < 0)
            timer = period;

        // update progressbar
        $(progressbar).css('width', (timer * 100 / period) + '%').attr('aria-valuenow', timer).find('span').text(timer + ' seconds remaining.');

        // timer action
        if(timer === 0) {
            deck_history.autosave();
        }

        timer--;
    }

    /**
     * @memberOf deck_history
     */
    deck_history.add_snapshot = function add_snapshot(snapshot)
    {

        snapshot.date_creation = snapshot.date_creation ? moment(snapshot.date_creation) : moment();
        snapshots.push(snapshot);

        var list = [];
        if(snapshot.variation) {
            _.each(snapshot.variation[0], function (qty, code)
            {
                var card = app.data.cards.findById(code);
                if(!card)
                    return;
                list.push('+' + qty + ' ' + '<a href="' + Routing.generate('cards_zoom', {card_code: code}) + '" class="card-tip" data-code="' + code + '">' + card.label + '</a>');
            });
            _.each(snapshot.variation[1], function (qty, code)
            {
                var card = app.data.cards.findById(code);
                if(!card)
                    return;
                list.push('&minus;' + qty + ' ' + '<a href="' + Routing.generate('cards_zoom', {card_code: code}) + '" class="card-tip" data-code="' + code + '">' + card.label + '</a>');
            });
        } else {
            list.push(Translator.trans('decks.history.firstversion'));
        }

        tbody.prepend('<tr' + (snapshot.is_saved ? '' : ' class="warning"') + '><td>' + snapshot.date_creation.calendar() + (snapshot.is_saved ? '' : ' (' + Translator.trans('decks.history.unsaved') + ')') + '</td><td>' + (snapshot.version || '') + '</td><td>' + list.join('<br>') + '</td><td><a role="button" href="#" data-index="' + (snapshots.length - 1) + '"">' + Translator.trans('decks.history.revert') + '</a></td></tr>');

        timer = -1; // start autosave timer

    }

    /**
     * @memberOf deck_history
     */
    deck_history.load_snapshot = function load_snapshot(event)
    {

        var index = $(this).data('index');
        var snapshot = snapshots[index];
        if(!snapshot)
            return;

        app.data.cards.find({}).forEach(function (card)
        {
            var indeck = 0;
            if(snapshot.content[card.code]) {
                indeck = snapshot.content[card.code];
            }
            app.data.cards.updateById(card.code, {
                indeck: indeck
            });
        });

        app.ui.on_deck_modified();
        changed_since_last_autosave = true;

        // cancel event
        return false;

    }

    /**
     * @memberOf deck_history
     */
    deck_history.notify_change = function notify_change()
    {
        changed_since_last_autosave = true;
    }

    deck_history.get_unsaved_edits = function get_unsaved_edits()
    {
        return _.filter(snapshots, function (snapshot)
        {
            return snapshot.is_saved === false;
        }).sort(function (a, b)
        {
            return a.date_creation - b.datecreation;
        });
    }

    deck_history.is_changed_since_last_autosave = function is_changed_since_last_autosave()
    {
        return changed_since_last_autosave;
    }

    deck_history.init = function init(data)
    {
        snapshots_init = data;
    }

    /**
     * @memberOf deck_history
     * @param container
     */
    deck_history.setup = function setup_history(container)
    {
        tbody = $(container).find('tbody').on('click', 'a[role=button]', deck_history.load_snapshot);
        progressbar = $(container).find('.progress-bar');

        clock = setInterval(deck_history.autosave_interval, 1000);

        snapshots_init.forEach(function (snapshot)
        {
            deck_history.add_snapshot(snapshot);
        });

    }

})(app.deck_history = {}, jQuery);
