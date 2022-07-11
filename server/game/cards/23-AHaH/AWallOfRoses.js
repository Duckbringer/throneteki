const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');
const TextHelper = require('../../TextHelper');

class AWallOfRoses extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRemovedFromChallenge: event => event.isAttacking
            },
            cost: ability.costs.payXGold(() => 1, context => context.event.challenge.defenders.length),
            message: {
                format: '{player} uses {source} to choose {xValue} characters',
                args: { xValue: context => context.xValue }
            },
            handler: context => {
                let xValue = context.xValue;
                this.game.promptForSelect(context.player, {
                    mode: 'exactly',
                    numCards: xValue,
                    activePromptTitle: `Select ${TextHelper.count(xValue, 'character')}`,
                    source: this,
                    cardCondition: { defending: true },
                    onSelect: (player, cards) => this.targetsSelected(context, player, cards)
                });
            } 
        });
    }

    targetsSelected(context, player, cards) {
        this.game.addMessage('{0} chooses {1} for {2}', player, cards, this);

        this.game.once('afterChallenge:interrupt', event => this.resolveIfWin(context, player, event.challenge, cards));

        return true;
    }

    resolveIfWin(context, player, challenge, cards) {
        if(challenge.winner !== player) {
            return;
        }

        let gameActions = [GameActions.gainPower({ card: player.faction, amount: 2 })];
        gameActions.concat(cards.map(card => GameActions.standCard({ card: card })));
        
        this.game.addMessage('{0} then uses {1} to gain 2 power and stand {2}', player, this, cards);
        this.game.resolveGameAction(GameActions.simultaneously(gameActions), context);
    }
}

AWallOfRoses.code = '23016';

module.exports = AWallOfRoses;
