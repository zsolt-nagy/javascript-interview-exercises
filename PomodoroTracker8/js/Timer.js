export default class Timer {
    constructor( countdownInitialValue, displayTimeCallback ) {
        this.countdownInitialValue = countdownInitialValue;
        this.secondsLeft = countdownInitialValue;
        this.interval = null;
        this.displayTimeCallback = displayTimeCallback;
        this.displayTimeCallback( this.toString() );
    }
    toString() {
        const minutes = Math.floor( this.secondsLeft / 60 );
        const seconds = 
            ( '' + ( this.secondsLeft % 60 ) )
                .padStart( 2, '0' );
        return `${minutes}:${seconds}`;   
    }
    start() {
        let startTimestamp = Date.now();
        let startSeconds = this.secondsLeft;
        this.interval = setInterval( () => {
            let oldSecondsLeft = this.secondsLeft;
            let secondsPassed = 
                Math.floor( ( Date.now() - startTimestamp ) / 1000 );
            this.secondsLeft = 
                Math.max( 0, startSeconds - secondsPassed );
            if ( this.secondsLeft < oldSecondsLeft ) {
                this.displayTimeCallback( this.toString() );
            }                
            if ( this.secondsLeft == 0 ) {
                clearInterval( this.interval );
            }
        }, 100 );
    }
    pause() {
        if ( typeof this.interval === 'number' ) {
            clearInterval( this.interval )
        }
    }
    reset() {
        this.pause();
        this.secondsLeft = this.countdownInitialValue;
        this.displayTimeCallback( this.toString() );
    }
}
