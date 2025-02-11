const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class PrinceOfTheNarrowSea extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction(
            { faction: 'baratheon', unique: true }
        );
        this.whileAttached({
            match: card => card.name === 'Salladhor Saan',
            effect: [
                ability.effects.addKeyword('Renown'),
                ability.effects.addTrait('Commander')
            ]
        });
        this.plotModifiers({
            initiative: -1
        });
        
        this.reaction({
            when: {
                onInitiativeDetermined: event => event.winner !== this.controller
            },
            cost: ability.costs.returnToHand(card => card.isMatch({ trait: 'Smuggler', type: 'character' })),
            targets: {
                character: {
                    activePromptTitle: 'Select a character',
                    cardCondition: { type: 'character', location: 'play area', condition: (card, context) => !context.costs.returnToHand || card.getPrintedCost() < context.costs.returnToHand.getPrintedCost() }
                },
                location: {
                    activePromptTitle: 'Select a location',
                    cardCondition: { type: 'location', location: 'play area', condition: (card, context) => !context.costs.returnToHand || card.getPrintedCost() < context.costs.returnToHand.getPrintedCost() }
                }
            },
            message: {
                format: '{player} uses {source} and returns {returnedToHand} to its owners hand to kneel {knelt}',
                args: { 
                    returnedToHand: context => context.costs.returnToHand,
                    knelt: context => context.targets.getTargets()
                }
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.targets.getTargets().map(card => GameActions.kneelCard({ card: card }), context)
                    ), context
                );
            }
        });
    }
}

PrinceOfTheNarrowSea.code = '23002';

module.exports = PrinceOfTheNarrowSea;
