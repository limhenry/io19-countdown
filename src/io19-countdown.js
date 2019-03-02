import { Countdown as CountdownController } from './countdown';

class Io19Countdown extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .js-countdown {
                    margin: 8px;
                }
                
                .countdown {
                    display: flex;
                    flex-wrap: wrap;
                    max-width: calc(100% - 16px);
                }
                
                .unitWrapper {
                    display: flex;
                    position: relative;
                    width: calc(50% - ((((100% - 120px) / 7) * 1) + 0px + 0px)/2);
                }
                
                .unitWrapper:first-child, .unitWrapper:nth-child(2) {
                    margin-bottom: 64px;
                }
                
                .unitWrapper:nth-child(2n) {
                    margin-left: calc((((100% - 120px) / 7) * 1) + 0px + 0px);
                }
                
                .digit {
                    display: flex;
                    flex-basis: 50%;
                }
                
                .digit:nth-child(2n) {
                    margin-left: 8px;
                }
                
                .unitLabel {
                    bottom: 0;
                    font-size: 14px;
                    font-weight: 500;
                    position: absolute;
                    right: -8px;
                    transform: translateX(100%);
                }
                
                .blue.darkfill path {
                    fill: #3d82f8
                }
                
                .blue.lightfill path {
                    fill: #d1e3fd
                }
                
                .blue.darkstroke path {
                    stroke: #adcaf9
                }
                
                .blue.lightstroke path {
                    stroke: #d1e3fd
                }
                
                .red.darkfill path {
                    fill: #e5443f
                }
                
                .red.lightfill path {
                    fill: #fce8e6
                }
                
                .red.darkstroke path {
                    stroke: #fad2cf
                }
                
                .red.lightstroke path {
                    stroke: #fce8e6
                }
                
                .yellow.darkfill path {
                    fill: #f9b923
                }
                
                .yellow.lightfill path {
                    fill: #feeec3
                }
                
                .yellow.darkstroke path {
                    stroke: #fce198
                }
                
                .yellow.lightstroke path {
                    stroke: #feeec3
                }
                
                .green.darkfill path {
                    fill: #2ea94f
                }
                
                .green.lightfill path {
                    fill: #cdead5
                }
                
                .green.darkstroke path {
                    stroke: #a7dbb4
                }
                
                .green.lightstroke path {
                    stroke: #cdead5
                }
                
                @media screen and (min-width: 600px) {
                    .countdown {
                        max-width: calc(100% - 40px);
                    }
                }
            </style>
            <div class="js-countdown countdownContainer">
                <div class="countdown" aria-hidden="true" role="presentation">
                    <div class="unitWrapper">
                        <div class="style.digit js-digit" data-unit="days" data-max-number="nine"></div>
                        <div class="style.digit js-digit" data-unit="days" data-max-number="nine"></div>
                        <span class="unitLabel">D</span>
                    </div>
                    <div class="unitWrapper">
                        <div class="style.digit js-digit" data-unit="hours" data-max-number="two"></div>
                        <div class="style.digit js-digit" data-unit="hours" data-max-number="nine"></div>
                        <span class="unitLabel">H</span>
                    </div>
                    <div class="unitWrapper">
                        <div class="style.digit js-digit" data-unit="minutes" data-max-number="five"></div>
                        <div class="style.digit js-digit" data-unit="minutes" data-max-number="nine"></div>
                        <span class="unitLabel">M</span>
                    </div>
                    <div class="unitWrapper">
                        <div class="style.digit js-digit" data-unit="seconds" data-max-number="five"></div>
                        <div class="style.digit js-digit" data-unit="seconds" data-max-number="nine"></div>
                        <span class="unitLabel">S</span>
                    </div>
                </div>
            </div>
      `;
    }

    connectedCallback() {
        let countdownContainer = this.shadowRoot.querySelector('.countdownContainer');
        this.controller = new CountdownController(
            countdownContainer,
            this.getAttribute('date')
        );
        this.controller.init();
    }
}

window.customElements.define('io19-countdown', Io19Countdown);

