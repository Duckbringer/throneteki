const GameAction = require('./GameAction');
const DeclareAsAttacker = require('./DeclareAsAttacker');
const BypassByStealth = require('./BypassByStealth');
const AssaultKeywordAction = require('./AssaultkeywordAction');

class InitiateChallenge extends GameAction {
    constructor() {
        super('initiateChallenge');
    }

    createEvent({ challenge }) {
        const challengeEvent = this.event('onChallengeInitiated', { challenge }, event => {
            const bypassedByStealthEvents = challenge.stealthData.map(stealthChoice => BypassByStealth.createEvent({ challenge, source: stealthChoice.source, target: stealthChoice.target }));
            const assaultedEvents = challenge.assaultData.map(assaultChoice => AssaultKeywordAction.createEvent({ challenge, source: assaultChoice.source, target: assaultChoice.target }));
            event.challenge.initiateChallenge();

            for(const bypassedByStealthEvent of bypassedByStealthEvents) {
                event.thenAttachEvent(bypassedByStealthEvent);
            }

            for(const assaultedEvent of assaultedEvents) {
                event.thenAttachEvent(assaultedEvent);
            }
        });
        const declaredAttackerEvents = challenge.declaredAttackers.map(card => DeclareAsAttacker.createEvent({ card, challenge }));
        return this.atomic(
            challengeEvent,
            ...declaredAttackerEvents
        );
    }
}

module.exports = new InitiateChallenge();
