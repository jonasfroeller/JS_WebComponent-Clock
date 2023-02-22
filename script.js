// Digital Clock
function isColor(strColor) {
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}
const hexColorPatternV1 = /#[A-z0-9]{3,6}/;
const hexColorPatternV2 = /[A-z0-9]{3,6}/;
const digitalClock = document.createElement("template");
digitalClock.innerHTML = `
    <style>
    #clock-digital {
        --data-color: #fff;
        --data-backgroundColor: #000;
        font-family: 'Goldman';
        font-size: 125%;
        max-width: 90vw;
        width: 43.75rem;
        text-align: center;
        color: var(--data-color);
        background-color: var(--data-backgroundColor);
        border: 0.25rem solid var(--data-color);
        border-radius: 1vh;
        display: grid;
        grid-template-columns: 5% auto;
    }
    
    #clock-day {
        writing-mode: vertical-rl;
        text-orientation: upright;
        letter-spacing: 0px;
        padding-left: 50px;
        padding-bottom: 20px;
    }
    
    #clock-dynamic-display {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    
    #clock-time {
        width: 31.25rem;
        display: grid;
        justify-content: center;
        grid-template-columns: calc(100% / 4) calc(100% / 8) calc(100% / 4) calc(100% / 8) calc(100% / 4);
        font-size: 200%;
    }
    
    #clock-hours, #clock-minutes, #clock-seconds, #clock-AmPm {
        background-color: transparent;
    }
    
    #clock-date {
        font-size: 175%;
    }
    </style>

    <div id="clock-digital">
    <div id="clock-day">XXX</div>
    <div id="clock-dynamic-display">
        <div id="clock-time">
            <div id="clock-hours">00</div>
            <div>:</div>
            <div id="clock-minutes">00</div>
            <div>:</div>
            <div id="clock-seconds">00</div>
        </div>
        <div id="clock-date">00.00.0000</div>
        <div id="clock-region">xxx</div>
    </div>
    </div>
`;

// Define ES6 class
class DigitalClock extends HTMLElement {
  constructor() {
    let self = super();
    console.log(self);

    // SHADOW DOM
    this.attachShadow({
      mode: "open",
    });

    this.shadowRoot.appendChild(digitalClock.content.cloneNode(true));
    console.log(this.shadowRoot.querySelector("#clock-digital"));
  }

  static get observedAttributes() {
    return [
      "data-timezone",
      "data-language",
      "data-color",
      "data-backgroundcolor",
    ]; // only lowercase allowed!!!
  }

  // customize template with attributes
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (newValue != "") {
      if (attrName == "data-timezone") {
        if (
          newValue.length >= 2 &&
          newValue.match(/\//g).length == 1 &&
          newValue.match(/,/g).length == 1
        ) {
          let s1 = newValue.split(",");
          let s2 = s1[1].split("/");
          let dynamicDate = new Date().toLocaleString(`${s1[0].trim()}`, {
            timeZone: `${s2[0].trim()}/${s2[1].trim()}`,
          });
          this.shadowRoot.querySelector("#clock-region").innerHTML =
            s2[0].trim() + "/" + s2[1].trim();
          console.log(dynamicDate);

          this.updateDigitalClock(dynamicDate);
          let thisElem = this;
          setInterval(function () {
            let dynamicDate = new Date().toLocaleString(`${s1[0].trim()}`, {
              timeZone: `${s2[0].trim()}/${s2[1].trim()}`,
            });

            thisElem.updateDigitalClock(dynamicDate);
          }, 1000);
        } else {
          console.log(
            `${attrName}:`,
            `Invalid Attribute data! (${newValue.toLowerCase()})`
          );
        }
      }
      if (attrName == "data-language") {
        let todaysDate = new Date();
        let dayAsText;
        if (newValue.match(/[a-z]{2}-[A-Z]{2}/)) {
          dayAsText = todaysDate.toLocaleDateString(newValue, {
            // "au-AU"
            weekday: "long",
          });
          this.shadowRoot.querySelector("#clock-day").innerHTML = dayAsText;
          console.log(`${attrName}:`, newValue, dayAsText);
        } else if (newValue.match(/[a-z]{2}/)) {
          dayAsText = todaysDate.toLocaleDateString(
            newValue.toLowerCase() + "-" + newValue.toUpperCase(),
            {
              // "au-AU"
              weekday: "long",
            }
          );
          this.shadowRoot.querySelector("#clock-day").innerHTML = dayAsText;
          console.log(
            `${attrName}:`,
            newValue.toLowerCase() + "-" + newValue.toUpperCase(),
            dayAsText
          );
        } else {
          console.log(
            `${attrName}:`,
            `Invalid Attribute data! (${newValue.toLowerCase()})`
          );
        }
      }
      if (attrName == "data-color") {
        // document.documentElement.style.setProperty('--data-backgroundColor', `${newValue}`);
        if (newValue.match(hexColorPatternV1)) {
          console.log(`${attrName}:`, newValue.toLowerCase());
          this.shadowRoot
            .querySelector("#clock-digital")
            .style.setProperty("--data-color", newValue);
        } else if (newValue.match(hexColorPatternV2) && !isColor(newValue)) {
          console.log(`${attrName}:`, "#" + newValue.toLowerCase());
          this.shadowRoot
            .querySelector("#clock-digital")
            .style.setProperty("--data-color", "#" + newValue);
        } else {
          if (isColor(newValue)) {
            this.shadowRoot
              .querySelector("#clock-digital")
              .style.setProperty("--data-color", newValue);
          } else {
            console.log(
              `${attrName}:`,
              `Invalid Attribute data! (${newValue.toLowerCase()})`
            );
          }
        }
      }
      if (attrName == "data-backgroundcolor") {
        // document.documentElement.style.setProperty('--data-backgroundColor', `${newValue}`);
        if (newValue.match(hexColorPatternV1)) {
          console.log(`${attrName}:`, newValue.toLowerCase());
          this.shadowRoot
            .querySelector("#clock-digital")
            .style.setProperty("--data-backgroundColor", newValue);
        } else if (newValue.match(hexColorPatternV2) && !isColor(newValue)) {
          console.log(`${attrName}:`, "#" + newValue.toLowerCase());
          this.shadowRoot
            .querySelector("#clock-digital")
            .style.setProperty("--data-backgroundColor", "#" + newValue);
        } else {
          if (isColor(newValue)) {
            this.shadowRoot
              .querySelector("#clock-digital")
              .style.setProperty("--data-backgroundColor", newValue);
          } else {
            console.log(
              `${attrName}:`,
              `Invalid Attribute data! (${newValue.toLowerCase()})`
            );
          }
        }
      }
    } else {
      let dynamicDate = new Date();

      this.updateDigitalClock(dynamicDate);
      let thisElem = this;
      setInterval(function () {
        let dynamicDate = new Date();

        thisElem.updateDigitalClock(dynamicDate);
      }, 1000);
      console.log(
        `${attrName}:`,
        `Invalid Attribute data! (${newValue.toLowerCase()})`
      );
    }
  }

  updateDigitalClock(date) {
    let dynamicDate = new Date(date);
    let element = this.shadowRoot.querySelector("#clock-digital");

    let day = String(dynamicDate.getDate()).padStart(2, "0");
    let month = String(dynamicDate.getMonth() + 1).padStart(2, "0");
    let year = dynamicDate.getFullYear();
    let dateToday = day + "." + month + "." + year;
    element.querySelector("#clock-date").innerHTML = dateToday;

    let hour = dynamicDate.getHours();
    let min = dynamicDate.getMinutes();
    let sec = dynamicDate.getSeconds();

    // console.log(element.querySelector("#clock-day").innerHTML + ",", dateToday);
    // console.log(hour, min, sec);
    // console.log(dynamicDate);

    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    element.querySelector("#clock-hours").innerHTML = hour;
    element.querySelector("#clock-minutes").innerHTML = min;
    element.querySelector("#clock-seconds").innerHTML = sec;
  }
}
// CUSTOM ELEMENT
window.customElements.define("digital-clock", DigitalClock); //<digital-clock>

// Digital Clock
const analogClock = document.createElement("template");
analogClock.innerHTML = `
    <style>
    #clock-analog {
        --data-maincolor: #fff;
        --data-secondarycolor: #eb9800;
        --data-backgroundcolor: #000;
        font-family: 'Goldman';
        width: 30rem;
        height: 30rem;
        border: 0.25rem solid var(--data-maincolor);
        padding: 1rem;
        border-radius: 50%;
        position: relative;
        background-color: var(--data-backgroundcolor);
    }
    
    .outer-clock-face {
        clip-path: circle();
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        background-color: var(--data-backgroundcolor);
    }
    
    .inner-clock-face {
        position: absolute;
        top: 10%;
        left: 10%;
        width: 80%;
        height: 80%;
        z-index: 1;
        background: var(--data-backgroundcolor);
    }
    
    .inner-clock-face::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        border-radius: 18px;
        margin-left: -9px;
        margin-top: -6px;
        background: var(--data-secondarycolor);
        z-index: 11;
    }
    
    .hand {
        width: 50%;
        right: 50%;
        height: 6px;
        background: var(--data-maincolor);
        position: absolute;
        top: 50%;
        border-radius: 6px;
        transform-origin: 100%;
        transform: rotate(90deg);
        transition-timing-function: cubic-bezier(0.1, 2.7, 0.58, 1);
    }
    
    .hand.hour-hand {
        width: 30%;
        z-index: 3;
    }
    
    .hand.min-hand {
        height: 3px;
        z-index: 10;
        width: 40%;
    }
    
    .hand.second-hand {
        background: var(--data-secondarycolor);
        width: 45%;
        height: 2px;
    }
    
    ul {
        list-style: none;
        top: 0;
        margin: 0;
        padding: 0;
        position: absolute;
        text-align: center;
      }
      
      li {
        position: absolute;
        transform-origin: 50% 100%;
        height: 15rem;
        color: var(--data-maincolor);
        font-weight: bold;
        font-size: 150%;
        z-index: 100;
      }
      
      .hours {
        z-index: 100;
        left: calc(15rem - 40px);
        font-size: 23.3333333333px;
        letter-spacing: -1.6px;
        line-height: 45px;
      }
      .hours li {
        width: 80px;
      }
      .hours span {
        display: block;
      }
      .hours li:nth-of-type(1) {
        transform: rotate(30deg);
      }
      .hours li:nth-of-type(1) span {
        transform: rotate(-30deg);
      }
      .hours li:nth-of-type(2) {
        transform: rotate(60deg);
      }
      .hours li:nth-of-type(2) span {
        transform: rotate(-60deg);
      }
      .hours li:nth-of-type(3) {
        transform: rotate(90deg);
      }
      .hours li:nth-of-type(3) span {
        transform: rotate(-90deg);
      }
      .hours li:nth-of-type(4) {
        transform: rotate(120deg);
      }
      .hours li:nth-of-type(4) span {
        transform: rotate(-120deg);
      }
      .hours li:nth-of-type(5) {
        transform: rotate(150deg);
      }
      .hours li:nth-of-type(5) span {
        transform: rotate(-150deg);
      }
      .hours li:nth-of-type(6) {
        transform: rotate(180deg);
      }
      .hours li:nth-of-type(6) span {
        transform: rotate(-180deg);
      }
      .hours li:nth-of-type(7) {
        transform: rotate(210deg);
      }
      .hours li:nth-of-type(7) span {
        transform: rotate(-210deg);
      }
      .hours li:nth-of-type(8) {
        transform: rotate(240deg);
      }
      .hours li:nth-of-type(8) span {
        transform: rotate(-240deg);
      }
      .hours li:nth-of-type(9) {
        transform: rotate(270deg);
      }
      .hours li:nth-of-type(9) span {
        transform: rotate(-270deg);
      }
      .hours li:nth-of-type(10) {
        transform: rotate(300deg);
      }
      .hours li:nth-of-type(10) span {
        transform: rotate(-300deg);
      }
      .hours li:nth-of-type(11) {
        transform: rotate(330deg);
      }
      .hours li:nth-of-type(11) span {
        transform: rotate(-330deg);
      }
      .hours li:nth-of-type(12) {
        transform: rotate(360deg);
      }
      .hours li:nth-of-type(12) span {
        transform: rotate(-360deg);
      }
    </style>

	<div id="clock-analog">
		<div class="outer-clock-face">
			<ul class='hours'>
				<li>
					<span>
						1
					</span>
				</li>
				<li>
					<span>
						2
					</span>
				</li>
				<li>
					<span>
						3
					</span>
				</li>
				<li>
					<span>
						4
					</span>
				</li>
				<li>
					<span>
						5
					</span>
				</li>
				<li>
					<span>
						6
					</span>
				</li>
				<li>
					<span>
						7
					</span>
				</li>
				<li>
					<span>
						8
					</span>
				</li>
				<li>
					<span>
						9
					</span>
				</li>
				<li>
					<span>
						10
					</span>
				</li>
				<li>
					<span>
						11
					</span>
				</li>
				<li>
					<span>
						12
					</span>
				</li>
			</ul>
			<div class="inner-clock-face">
				<div class="hand hour-hand"></div>
				<div class="hand min-hand"></div>
				<div class="hand second-hand"></div>
			</div>
		</div>
	</div>
`; // #clock-analog

// Define ES6 class
class AnalogClock extends HTMLElement {
  constructor() {
    let self = super();
    console.log(self);

    // SHADOW DOM
    this.attachShadow({
      mode: "open",
    });
    this.shadowRoot.appendChild(analogClock.content.cloneNode(true));

    console.log(this.shadowRoot.querySelector("#clock-analog"));
  }

  static get observedAttributes() {
    return [
      "data-timezone",
      "data-maincolor",
      "data-secondarycolor",
      "data-backgroundcolor",
    ]; // only lowercase allowed!!!
  }

  // customize template with attributes
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (newValue != "") {
      if (attrName == "data-timezone") {
        if (newValue.includes("/") && newValue.includes(",")) {
          // newValue.length >= 2 && newValue.match(/\//g).length == 1 && newValue.match(/,/g).length == 1
          let s1 = newValue.split(",");
          let s2 = s1[1].split("/");
          let dynamicDate = new Date().toLocaleString(`${s1[0].trim()}`, {
            timeZone: `${s2[0].trim()}/${s2[1].trim()}`,
          });
          console.warn(dynamicDate);

          this.updateDigitalClock(dynamicDate);
          let thisElem = this;
          setInterval(function () {
            let dynamicDate = new Date().toLocaleString(`${s1[0].trim()}`, {
              timeZone: `${s2[0].trim()}/${s2[1].trim()}`,
            });

            thisElem.updateDigitalClock(dynamicDate);
          }, 1000);
        } else {
          console.log(
            `${attrName}:`,
            `Invalid Attribute data! (${newValue.toLowerCase()})`
          );
        }
      }
      if (attrName == "data-maincolor") {
        if (newValue.match(hexColorPatternV1)) {
          console.log(`${attrName}:`, newValue.toLowerCase());
          this.shadowRoot
            .querySelector("#clock-analog")
            .style.setProperty("--data-maincolor", newValue);
        } else if (newValue.match(hexColorPatternV2) && !isColor(newValue)) {
          console.log(`${attrName}:`, "#" + newValue.toLowerCase());
          this.shadowRoot
            .querySelector("#clock-analog")
            .style.setProperty("--data-maincolor", "#" + newValue);
        } else {
          if (isColor(newValue)) {
            this.shadowRoot
              .querySelector("#clock-analog")
              .style.setProperty("--data-maincolor", newValue);
          } else {
            console.log(
              `${attrName}:`,
              `Invalid Attribute data! (${newValue.toLowerCase()})`
            );
          }
        }
      }
      if (attrName == "data-secondarycolor") {
        if (newValue.match(hexColorPatternV1)) {
          console.log(`${attrName}:`, newValue.toLowerCase());
          this.shadowRoot
            .querySelector("#clock-analog")
            .style.setProperty("--data-secondarycolor", newValue);
        } else if (newValue.match(hexColorPatternV2) && !isColor(newValue)) {
          console.log(`${attrName}:`, "#" + newValue.toLowerCase());
          this.shadowRoot
            .querySelector("#clock-analog")
            .style.setProperty("--data-secondarycolor", "#" + newValue);
        } else {
          if (isColor(newValue)) {
            this.shadowRoot
              .querySelector("#clock-analog")
              .style.setProperty("--data-secondarycolor", newValue);
          } else {
            console.log(
              `${attrName}:`,
              `Invalid Attribute data! (${newValue.toLowerCase()})`
            );
          }
        }
      }
      if (attrName == "data-backgroundcolor") {
        if (newValue.match(hexColorPatternV1)) {
          console.log(`${attrName}:`, newValue.toLowerCase());
          this.shadowRoot
            .querySelector("#clock-analog")
            .style.setProperty("--data-backgroundcolor", newValue);
        } else if (newValue.match(hexColorPatternV2) && !isColor(newValue)) {
          console.log(`${attrName}:`, "#" + newValue.toLowerCase());
          this.shadowRoot
            .querySelector("#clock-analog")
            .style.setProperty("--data-backgroundcolor", "#" + newValue);
        } else {
          if (isColor(newValue)) {
            this.shadowRoot
              .querySelector("#clock-analog")
              .style.setProperty("--data-backgroundcolor", newValue);
          } else {
            console.log(
              `${attrName}:`,
              `Invalid Attribute data! (${newValue.toLowerCase()})`
            );
          }
        }
      }
    } else {
      let dynamicDate = new Date();

      this.updateDigitalClock(dynamicDate);
      let thisElem = this;
      setInterval(function () {
        let dynamicDate = new Date();

        thisElem.updateDigitalClock(dynamicDate);
      }, 1000);

      console.log(
        `${attrName}:`,
        `Invalid Attribute data! (${newValue.toLowerCase()})`
      );
    }
  }

  updateDigitalClock(date) {
    let element = this.shadowRoot.querySelector("#clock-analog");

    let dynamicDate = new Date(date);
    console.log(dynamicDate);

    let seconds = dynamicDate.getSeconds();
    let secondsDegrees = (seconds / 60) * 360 + 90;
    element.querySelector(
      ".second-hand"
    ).style.transform = `rotate(${secondsDegrees}deg)`;

    let mins = dynamicDate.getMinutes();
    let minsDegrees = (mins / 60) * 360 + (seconds / 60) * 6 + 90;
    element.querySelector(
      ".min-hand"
    ).style.transform = `rotate(${minsDegrees}deg)`;

    let hour = dynamicDate.getHours();
    let hourDegrees = (hour / 12) * 360 + (mins / 60) * 30 + 90;
    element.querySelector(
      ".hour-hand"
    ).style.transform = `rotate(${hourDegrees}deg)`;
  }
}
// CUSTOM ELEMENT
window.customElements.define("analog-clock", AnalogClock); //<analog-clock>
