const MarshalCardAction = require('../../../server/game/PlayActions/MarshalCardAction');

describe('MarshalCardAction', function () {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'on', 'raiseEvent', 'removeListener', 'queueSimpleStep']);
        this.gameSpy.raiseEvent.and.callFake(function(name, params, handler) {
            handler();
        });
        this.playerSpy = jasmine.createSpyObj('player', ['canDuplicate', 'canPutIntoPlay', 'isCardInPlayableLocation', 'putIntoPlay']);
        this.cardSpy = jasmine.createSpyObj('card', ['getType']);
        this.cardSpy.controller = this.playerSpy;
        this.cardSpy.owner = this.playerSpy;
        this.context = {
            costs: {},
            game: this.gameSpy,
            player: this.playerSpy,
            source: this.cardSpy
        };
        this.action = new MarshalCardAction();
    });

    describe('meetsRequirements()', function() {
        beforeEach(function() {
            this.gameSpy.currentPhase = 'marshal';
            this.playerSpy.allowMarshal = true;
            this.playerSpy.canDuplicate.and.returnValue(false);
            this.playerSpy.canPutIntoPlay.and.returnValue(true);
            this.playerSpy.isCardInPlayableLocation.and.returnValue(true);
            this.cardSpy.getType.and.returnValue('character');
        });

        describe('when all conditions are met', function() {
            it('should return true', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(true);
            });
        });

        describe('when the phase not marshal', function() {
            beforeEach(function() {
                this.gameSpy.currentPhase = 'dominance';
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is not in a valid marshal location', function() {
            beforeEach(function() {
                this.playerSpy.isCardInPlayableLocation.and.returnValue(false);
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is an event', function() {
            beforeEach(function() {
                this.cardSpy.getType.and.returnValue('event');
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card cannot be put into play', function() {
            beforeEach(function() {
                this.playerSpy.canPutIntoPlay.and.returnValue(false);
            });

            it('should return false', function() {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });
    });

    describe('executeHandler()', function() {
        beforeEach(function() {
            this.action.executeHandler(this.context);
        });

        it('should put the card into play', function() {
            expect(this.playerSpy.putIntoPlay).toHaveBeenCalledWith(this.cardSpy, 'marshal');
        });
    });
});
