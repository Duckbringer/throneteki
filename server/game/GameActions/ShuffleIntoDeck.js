const GameAction = require('./GameAction');
const Shuffle = require('./Shuffle');
const ReturnCardToDeck = require('./ReturnCardToDeck');

class ShuffleIntoDeck extends GameAction {
    constructor() {
        super('shuffleIntoDeck');
    }

    canChangeGameState({ cards }) {
        return cards.some(card => card.location !== 'draw deck');
    }

    createEvent({ cards, allowSave = true }) {
        return this.event('onCardsShuffledIntoDeck', { cards }, event => {
            for(const card of event.cards) {
                event.thenAttachEvent(ReturnCardToDeck.createEvent({card, allowSave}));
            }
            event.thenAttachEvent(this.createShuffleSequenceEvent(event.cards));
        });
    }

    createShuffleSequenceEvent(cards) {
        const players = new Set(cards.map(card => card.owner));
        const shuffleSequenceEvent = this.event('__SHUFFLE_SEQUENCE__');
        shuffleSequenceEvent.thenExecute(() => {
            for(const player of players) {
                shuffleSequenceEvent.thenAttachEvent(Shuffle.createEvent({ player }));
            }
        });
        return shuffleSequenceEvent;
    }
}

module.exports = new ShuffleIntoDeck();
