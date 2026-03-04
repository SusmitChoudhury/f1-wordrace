const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Formula One cars are the fastest regulated road-course racing cars in the world.",
    "Aerodynamics play a crucial role in the performance of modern racing vehicles.",
    "The pit crew can change all four tires in under three seconds during a race.",
    "Drafting allows a driver to gain speed by tailgating the car ahead and reducing drag.",
    "Pole position is awarded to the driver with the fastest qualifying lap time.",
    "The checkered flag is waved to signal the end of the race and the winner.",
    "Drivers experience extreme G-forces when cornering at high speeds on the track.",
    "Tire degradation can significantly impact a driver's strategy during a long sprint.",
    "Precision typing requires focus and rhythm to maintain a high words per minute rate.",
    "Mistakes can cost valuable seconds, just like a minor driving error on a tight curve.",
    "Continuous practice is the key to mastering both competitive typing and virtual racing.",
    "A smooth power delivery prevents wheel spin and maintains optimal traction on the asphalt.",
    "The steering wheel of a modern race car is equipped with dozens of buttons and switches.",
    "Telemtry data is transmitted in real-time from the car to the engineers on the pit wall."
];

export const generateRandomText = (wordCount: number = 30): string => {
    let result = "";
    while (result.split(' ').length < wordCount) {
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
        result += (result.length > 0 ? " " : "") + randomSentence;
    }

    // Trim to exact word count roughly
    const words = result.split(' ');
    return words.slice(0, wordCount).join(' ');
};
