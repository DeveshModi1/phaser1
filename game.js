const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let countdownTimer;
let clockSound;
let sessions = [];
let ball;

function preload() {
    this.load.image('startButton', './play.png');
    this.load.audio('clockSound', './ticking-clock_1-27477.mp3');
    this.load.image('ball', './tennis.png');
}


function create() {
    // Add Start Session button
    const startButton = this.add.image(100, 50, 'startButton').setInteractive();
    startButton.on('pointerdown', startSession, this);
    // Load clock ticking sound
    clockSound = this.sound.add('clockSound');

    // Create the right panel
    createRightPanel(this);

    // Create the ball
    ball = this.physics.add.sprite(400, 300, 'ball');
    ball.setCollideWorldBounds(true);
    ball.setBounce(1, 1);
    ball.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
}

function startSession() {
    // Generate random session ID
    const sessionId = generateRandomId();

    // Generate random counter value between 30 and 120 seconds
    const counterValue = Phaser.Math.Between(30, 120);

    // Display session details
    console.log(`Session ID: ${sessionId}`);
    console.log(`Counter Value: ${counterValue} seconds`);

    // Start countdown
    startCountdown(this, sessionId, counterValue, ball);
}

function startCountdown(scene, sessionId, seconds, ball) {
    let remainingSeconds = seconds;

    countdownTimer = scene.time.addEvent({
        delay: 1000,
        repeat: seconds - 1,
        callback: countdownTick,
        callbackScope: this,
        onComplete: () => {
            console.log("Countdown complete");

            // Store session information
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + seconds * 1000);
            sessions.push({
                sessionId: sessionId,
                startTime: startTime,
                endTime: endTime
            });

            // Update right panel
            updateRightPanel(scene);
        },
    });

    function countdownTick() {
        clockSound.play();
        console.log(remainingSeconds);

        // Move the ball randomly
        ball.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));

        remainingSeconds--;
    }
}

function generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Phaser.Math.Between(0, characters.length - 1));
    }
    return result;
}

function createRightPanel(scene) {
    const panel = scene.add.graphics();
    panel.fillStyle(0x333333, 1);
    panel.fillRect(600, 0, 200, 600);

    const style = {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#ffffff',
    };

    const title = scene.add.text(610, 10, 'Session History', style);

    // Add a group to store session information text
    scene.sessionTextGroup = scene.add.group();
}

function updateRightPanel(scene) {
    // Clear existing session text
    scene.sessionTextGroup.clear(true, true);

    // Display session information
    const style = {
        fontFamily: 'Arial',
        fontSize: 14,
        color: '#ffffff',
    };

    let yPos = 40;

    sessions.forEach(session => {
        const sessionInfo = `${session.sessionId}\nStart Time: ${session.startTime.toLocaleTimeString()}\nEnd Time: ${session.endTime.toLocaleTimeString()}\n`;
        const sessionText = scene.add.text(610, yPos, sessionInfo, style);
        scene.sessionTextGroup.add(sessionText);
        yPos += 80;
    });
}

function update() {
    // Add any additional game logic or animations here
}
