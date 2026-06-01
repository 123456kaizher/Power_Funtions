/**
 * Power Functions MakeCode Extension
 * Categories: Stepper Motor (ULN2003) & Joystick
 */

//% color="#FF5733" weight=100 icon="\uf1b6" block="Power Functions"
namespace powerFunctions {

    // --- STEPPER MOTOR CONFIGURATION ---
    let _in1 = DigitalPin.P8
    let _in2 = DigitalPin.P12
    let _in3 = DigitalPin.P13
    let _in4 = DigitalPin.P14
    let _stepDelay = 2 // default 2ms delay between steps

    // 4-step sequence for ULN2003 driver
    const stepSequence = [
        [1, 0, 0, 1], // Step 1
        [1, 1, 0, 0], // Step 2
        [0, 1, 1, 0], // Step 3
        [0, 0, 1, 1]  // Step 4
    ]

    function writeStep(step: number) {
        pins.digitalWritePin(_in1, stepSequence[step][0])
        pins.digitalWritePin(_in2, stepSequence[step][1])
        pins.digitalWritePin(_in3, stepSequence[step][2])
        pins.digitalWritePin(_in4, stepSequence[step][3])
    }

    /**
     * Initialize the ULN2003 Stepper Motor Pins
     * @param in1 Digital pin for IN1, eg: DigitalPin.P8
     * @param in2 Digital pin for IN2, eg: DigitalPin.P12
     * @param in3 Digital pin for IN3, eg: DigitalPin.P13
     * @param in4 Digital pin for IN4, eg: DigitalPin.P14
     */
    //% blockId=power_functions_init_stepper
    //% block="Initialize Stepper IN1:%in1 IN2:%in2 IN3:%in3 IN4:%in4"
    //% group="Stepper Motor" weight=90
    export function initStepper(in1: DigitalPin, in2: DigitalPin, in3: DigitalPin, in4: DigitalPin): void {
        _in1 = in1
        _in2 = in2
        _in3 = in3
        _in4 = in4
    }

    /**
     * Set speed of the stepper motor by adjusting the delay between steps (lower is faster)
     * @param delay ms delay between steps, eg: 2
     */
    //% blockId=power_functions_stepper_speed
    //% block="Set Stepper Delay %delay ms"
    //% delay.min=2 delay.max=50
    //% group="Stepper Motor" weight=85
    export function setStepperSpeed(delay: number): void {
        _stepDelay = Math.max(2, delay)
    }

    /**
     * Move the stepper motor a specific number of steps
     * @param steps number of steps to move, eg: 100
     * @param direction true for clockwise, false for counter-clockwise
     */
    //% blockId=power_functions_move_stepper
    //% block="Move Stepper %steps steps | CW: %clockwise"
    //% clockwise.shadow="toggleOnOff"
    //% group="Stepper Motor" weight=80
    export function moveStepper(steps: number, clockwise: boolean): void {
        for (let i = 0; i < steps; i++) {
            let currentStep = i % 4
            if (!clockwise) {
                currentStep = 3 - currentStep
            }
            writeStep(currentStep)
            basic.pause(_stepDelay)
        }
        // Turn off outputs to prevent overheating when not moving
        pins.digitalWritePin(_in1, 0)
        pins.digitalWritePin(_in2, 0)
        pins.digitalWritePin(_in3, 0)
        pins.digitalWritePin(_in4, 0)
    }


    // --- JOYSTICK CONFIGURATION ---
    let _joyX = AnalogPin.P1
    let _joyY = AnalogPin.P2
    let _joyK = DigitalPin.P16

    /**
     * Initialize the Keyestudio Joystick Pins
     * @param xPin Analog pin for X axis, eg: AnalogPin.P1
     * @param yPin Analog pin for Y axis, eg: AnalogPin.P2
     * @param kPin Digital pin for Button (Z axis), eg: DigitalPin.P16
     */
    //% blockId=power_functions_init_joystick
    //% block="Initialize Joystick X:%xPin Y:%yPin Button:%kPin"
    //% group="Joystick" weight=50
    export function initJoystick(xPin: AnalogPin, yPin: AnalogPin, kPin: DigitalPin): void {
        _joyX = xPin
        _joyY = yPin
        _joyK = kPin
        pins.setPull(_joyK, PinPullMode.PullUp) // Most joysticks need a pull-up resistor
    }

    /**
     * Read Joystick X value (0 - 1023)
     */
    //% blockId=power_functions_read_x
    //% block="Joystick X Value"
    //% group="Joystick" weight=45
    export function readX(): number {
        return pins.analogReadPin(_joyX)
    }

    /**
     * Read Joystick Y value (0 - 1023)
     */
    //% blockId=power_functions_read_y
    //% block="Joystick Y Value"
    //% group="Joystick" weight=40
    export function readY(): number {
        return pins.analogReadPin(_joyY)
    }

    /**
     * Check if Joystick Button is pressed
     */
    //% blockId=power_functions_joystick_button
    //% block="Joystick Button Pressed"
    //% group="Joystick" weight=35
    export function isButtonPressed(): boolean {
        // Returns true if button pulled to GND (0)
        return pins.digitalReadPin(_joyK) == 0
    }
}