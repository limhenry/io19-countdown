/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ANIMATIONS } from './data.js';

const FRAME_RANGES = {
    nine: {
        0: [285, 307],
        1: [255, 277],
        2: [225, 247],
        3: [195, 217],
        4: [165, 187],
        5: [135, 157],
        6: [105, 127],
        7: [75, 97],
        8: [45, 67],
        9: [15, 37],
    },

    five: {
        0: [165, 180],
        1: [135, 157],
        2: [105, 127],
        3: [75, 97],
        4: [45, 67],
        5: [15, 37],
    },

    two: {
        0: [75, 90],
        1: [45, 67],
        2: [15, 37],
    },
};

const COLORS = ['blue', 'red', 'yellow', 'green'];

export class Countdown {
    constructor(container, eventDate) {
        this.countdownContainer = container;
        this.endTime = Date.parse(eventDate.toString()) / 1000;
        this.daysCounter = null;
        this.hoursCounter = null;
        this.minutesCounter = null;
        this.secondsCounter = null;
        this.render = this.render.bind(this);
        this.getRandomColorNotMatchingSiblings = this.getRandomColorNotMatchingSiblings.bind(
            this,
        );
        this.assignRandomColor = this.assignRandomColor.bind(this);
        this.digitObjects = [];
        this.currentDigits = {
            seconds: {
                firstDigit: null,
                secondDigit: null,
            },
            minutes: {
                firstDigit: null,
                secondDigit: null,
            },
            hours: {
                firstDigit: null,
                secondDigit: null,
            },
            days: {
                firstDigit: null,
                secondDigit: null,
            },
        };
    }

    init() {
        const digitsElements = Array.from(
            this.countdownContainer.querySelectorAll('.js-digit'),
        );
        const numDigits = digitsElements.length;
        const numRows = 2;
        const numDigitsPerRow = numDigits / numRows;

        this.digitObjects = digitsElements.map((digit, index) => {
            const maxNumber = digit.dataset.maxNumber;
            let isDigitInFirstRow;
            let color;

            if (index < numDigitsPerRow) {
                isDigitInFirstRow = true;
                color = COLORS[index];
            } else {
                isDigitInFirstRow = false;
                color = null;
            }

            return {
                element: digit,
                animation: lottie.loadAnimation({
                    container: digit,
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    animationData: ANIMATIONS[maxNumber],
                }),
                frameRanges: FRAME_RANGES[maxNumber],
                lastColor: null,
                currentColor: color,
                currentNumber: null,
                lastNumber: null,
                prevDigitObject: null,
                nextDigitObject: null,
                firstRowDigit: isDigitInFirstRow,
            };
        });

        this.digitObjects.forEach((digitObject, index) => {
            for (let i = 0; i < numRows; i++) {
                if (numDigitsPerRow * (i + 1) - numDigitsPerRow === index) {
                    digitObject.prevDigitObject = null;
                    digitObject.nextDigitObject = this.digitObjects[index + 1];
                } else if (numDigitsPerRow * (i + 1) - 1 === index) {
                    digitObject.prevDigitObject = this.digitObjects[index - 1];
                    digitObject.nextDigitObject = null;
                } else {
                    digitObject.prevDigitObject = this.digitObjects[index - 1];
                    digitObject.nextDigitObject = this.digitObjects[index + 1];
                }
            }

            digitObject.animation.addEventListener('enterFrame', (event) => {
                if (event.currentTime === 21) {
                    if (digitObject.lastNumber) {
                        digitObject.element
                            .querySelectorAll(`.numbercompareDigits-${digitObject.lastNumber}`)
                            .forEach(el => {
                                el.classList.remove(digitObject.lastColor);
                            });
                    }
                }
            });
        });

        this.patchBodymovinClasses([
            'lightfill',
            'darkfill',
            'lightstroke',
            'darkstroke',
        ]);

        this.checkAndSetTime();
        this.render();
    }

    patchBodymovinClasses(classNames) {
        classNames.forEach(className => {
            this.countdownContainer.querySelectorAll(`.${className}`).forEach(el => {
                el.classList.add(className);
            });
        });
    }

    getFormattedLabel(num) {
        const numberString = num.toString();
        return num < 10 ? '0' + numberString : numberString;
    }

    getFormattedFirstDigit(num) {
        return num.toString().padStart(2, '0')[0];
    }

    getFormattedSecondDigit(num) {
        return num.toString().padStart(2, '0')[1];
    }

    getRandomColorNotMatchingSiblings(siblingColors) {
        let colorSet = new Set(COLORS);

        if (siblingColors) {
            siblingColors.forEach(color => {
                colorSet.delete(color);
            });
        }

        let colorArray = Array.from(colorSet);
        const randomIndex = Math.floor(Math.random() * colorArray.length);

        return colorArray[randomIndex];
    }

    assignRandomColor(digit, leftDigit, rightDigit) {
        let color;

        if (digit.firstRowDigit && this.onInitialLoadout) {
            color = digit.currentColor;
        } else if (leftDigit && rightDigit) {
            color = this.getRandomColorNotMatchingSiblings([
                leftDigit.currentColor,
                rightDigit.currentColor,
            ]);
        } else if (leftDigit) {
            color = this.getRandomColorNotMatchingSiblings([leftDigit.currentColor]);
        } else if (rightDigit) {
            color = this.getRandomColorNotMatchingSiblings([rightDigit.currentColor]);
        }

        digit.element
            .querySelectorAll(`.number-${digit.currentNumber}`)
            .forEach(el => {
                el.classList.add(color);
            });

        digit.lastColor = digit.currentColor;
        digit.currentColor = color;
    }

    compareDigits(
        firstDigitObj,
        secondDigitObj,
        label,
        currentDigits,
    ) {
        const currentFirstDigit = this.getFormattedFirstDigit(label);
        const currentSecondDigit = this.getFormattedSecondDigit(label);

        if (currentFirstDigit !== currentDigits['firstDigit']) {
            firstDigitObj.lastNumber = currentDigits['firstDigit'];
            firstDigitObj.currentNumber = parseInt(currentFirstDigit, 10);

            this.assignRandomColor(
                firstDigitObj,
                firstDigitObj.prevDigitObject,
                firstDigitObj.nextDigitObject,
            );

            firstDigitObj.animation.playSegments(
                [firstDigitObj.frameRanges[currentFirstDigit]],
                true,
            );

            currentDigits['firstDigit'] = currentFirstDigit;
        }

        if (currentSecondDigit !== currentDigits['secondDigit']) {
            secondDigitObj.lastNumber = currentDigits['secondDigit'];
            secondDigitObj.currentNumber = parseInt(currentSecondDigit, 10);

            this.assignRandomColor(
                secondDigitObj,
                secondDigitObj.prevDigitObject,
                secondDigitObj.nextDigitObject,
            );

            secondDigitObj.animation.playSegments(
                [secondDigitObj.frameRanges[currentSecondDigit]],
                true,
            );

            currentDigits['secondDigit'] = currentSecondDigit;
        }
    }

    getTime() {
        const now = Date.now() / 1000;
        const timeLeft = Math.max(this.endTime - now, 0);
        const daysLeft = Math.floor(timeLeft / 86400);
        const hoursLeft = Math.floor((timeLeft - daysLeft * 86400) / 3600);
        const minutesLeft = Math.floor(
            (timeLeft - daysLeft * 86400 - hoursLeft * 3600) / 60,
        );
        const secondsLeft = Math.floor(
            timeLeft - daysLeft * 86400 - hoursLeft * 3600 - minutesLeft * 60,
        );

        return {
            now: now,
            timeLeft: timeLeft,
            daysLeft: daysLeft,
            hoursLeft: hoursLeft,
            minutesLeft: minutesLeft,
            secondsLeft: secondsLeft,
        };
    }

    checkAndSetTime() {
        const time = this.getTime();

        if (this.secondsCounter !== time.secondsLeft) {
            this.setSeconds(time);
        }

        if (this.minutesCounter !== time.minutesLeft) {
            this.setMinutes(time);
        }

        if (this.hoursCounter !== time.hoursLeft) {
            this.setHours(time);
        }

        if (this.daysCounter !== time.daysLeft) {
            this.setDays(time);
            this.setAriaLabel(time.daysLeft);
        }
    }

    /**
     * Sets aria label for the countdown container
     * @param {number} daysLeft the number of days left
     */

    setAriaLabel(daysLeft) {
        this.countdownContainer.setAttribute(
            'aria-label',
            `Countdown to I/O: ${daysLeft} days left`,
        );
    }

    setDays(time) {
        const daysLabel = this.getFormattedLabel(time.daysLeft);
        const currentDigits = this.currentDigits.days;

        this.compareDigits(
            this.digitObjects[0],
            this.digitObjects[1],
            daysLabel,
            currentDigits,
        );

        this.daysCounter = time.daysLeft;
    }

    setHours(time) {
        const hoursLabel = this.getFormattedLabel(time.hoursLeft);
        const currentDigits = this.currentDigits.hours;

        this.compareDigits(
            this.digitObjects[2],
            this.digitObjects[3],
            hoursLabel,
            currentDigits,
        );

        this.hoursCounter = time.hoursLeft;
    }

    setMinutes(time) {
        const minutesLabel = this.getFormattedLabel(time.minutesLeft);
        const currentDigits = this.currentDigits.minutes;

        this.compareDigits(
            this.digitObjects[4],
            this.digitObjects[5],
            minutesLabel,
            currentDigits,
        );

        this.minutesCounter = time.minutesLeft;
    }

    setSeconds(time) {
        const secondsLabel = this.getFormattedLabel(time.secondsLeft);
        const currentDigits = this.currentDigits.seconds;

        this.compareDigits(
            this.digitObjects[6],
            this.digitObjects[7],
            secondsLabel,
            currentDigits,
        );

        this.secondsCounter = time.secondsLeft;
    }

    render() {
        this.onInitialLoadout = false;
        this.checkAndSetTime();

        requestAnimationFrame(this.render);
    }
}