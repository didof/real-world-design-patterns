interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  private isOn = false;

  public turnOn() {
    this.isOn = true;
  }

  public turnOff() {
    this.isOn = false;
  }

  public getState(): boolean {
    return this.isOn;
  }
}

class Thermostat {
  private temperature = 21;

  public getTemperature(): number {
    return this.temperature;
  }

  public setTemperature(temp: number) {
    this.temperature = temp;
  }
}

class LightToggleCommand implements Command {
  constructor(private light: Light) {}

  public execute(): void {
    if (this.light.getState()) {
      this.light.turnOff();
    } else {
      this.light.turnOn();
    }
  }

  public undo(): void {
    this.execute();
  }
}

class TemperatureIncreaseCommand implements Command {
  constructor(private thermostat: Thermostat) {}

  public execute(): void {
    const temp = this.thermostat.getTemperature();
    this.thermostat.setTemperature(temp + 1);
  }

  public undo(): void {
    const temp = this.thermostat.getTemperature();
    this.thermostat.setTemperature(temp - 1);
  }
}

class TemperatureDecreaseCommand implements Command {
  private thermostat: Thermostat;
  constructor(t: Thermostat) {
    this.thermostat = t;
  }

  public execute(): void {
    const temp = this.thermostat.getTemperature();
    this.thermostat.setTemperature(temp - 1);
  }

  public undo(): void {
    const temp = this.thermostat.getTemperature();
    this.thermostat.setTemperature(temp + 1);
  }
}

// -- Bringing It All Together --

class RemoteControl {
  private commands: Command[] = [];
  private history: Command[] = [];

  public setCommand(slot: number, command: Command) {
    this.commands[slot] = command;
  }

  public onButtonPressed(slot: number) {
    const command = this.commands[slot];
    if (command) {
      command.execute();
      this.history.push(command);
    }
  }

  public onUndoButtonPressed() {
    const lastCommand = this.history.pop();
    lastCommand?.undo();
  }
}

function logStatus(action: string) {
  console.info(action);
  console.table(
    [
      { name: "light", value: light.getState() },
      { name: "temperature", value: thermostat.getTemperature() },
    ],
    ["name", "value"]
  );
}

// -- Let's run it --

const light = new Light();
const thermostat = new Thermostat();

const toggleLight = new LightToggleCommand(light);
const temperatureUp = new TemperatureIncreaseCommand(thermostat);
const temperatureDown = new TemperatureDecreaseCommand(thermostat);

const remote = new RemoteControl();
remote.setCommand(0, toggleLight);
remote.setCommand(1, temperatureUp);
remote.setCommand(2, temperatureDown);
logStatus("Initial status");

remote.onButtonPressed(0); // > Light is ON
logStatus("LightToggle");

remote.onButtonPressed(0); // > Light is OFF
logStatus("LightToggle");

remote.onButtonPressed(1); // > Thermostat set to 22°C
logStatus("TemperatureUp");

remote.onButtonPressed(1); // > Thermostat set to 23°C
logStatus("TemperatureUp");

remote.onUndoButtonPressed(); // > Thermostat set to 22°C
logStatus("Undo");

remote.onUndoButtonPressed(); // > Thermostat set to 12°C
logStatus("Undo");

remote.onUndoButtonPressed(); // > Light is ON
logStatus("Undo");

remote.onUndoButtonPressed(); // > Light is OFF
logStatus("Undo");

remote.onUndoButtonPressed();
remote.onUndoButtonPressed();
remote.onUndoButtonPressed(); // > Freezed to Initial status
logStatus("Undo but history is empty");
