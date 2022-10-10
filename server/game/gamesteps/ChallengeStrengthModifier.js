class ChallengeStrengthModifier extends BaseModifier {
    constructor(game, source, challenge, strengthFunc) {
        super(game, source);
        this.game = game;
        this.source = source;
        this.challenge = challenge;
        this.strengthFunc = this.buildStrengthFunc(strengthFunc);
    }

    get() {
        return this.strengthFunc(this.source, this.challenge);
    }

    buildStrengthFunc(strengthFunc) {
        if(typeof(strengthFunc) === 'function') {
            return strengthFunc;
        }
        return () => strengthFunc;
    }
}

module.exports = ChallengeStrengthModifier;