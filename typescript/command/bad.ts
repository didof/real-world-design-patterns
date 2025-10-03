class NaiveRemoteControl {
  private light: { on: () => void; off: () => void };
  private thermostat: { setTemperature: (t: number) => void };

  constructor(l: any, t: any) {
    this.light = l;
    this.thermostat = t;
  }

  onButtonPressed(button: string) {
    if (button === "livingRoomLightOn") {
      this.light.on();
    } else if (button === "livingRoomLightOff") {
      this.light.off();
    } else if (button === "thermostatUp") {
      this.thermostat.setTemperature(22);
    }
    // ...and so on for every single action
  }
}