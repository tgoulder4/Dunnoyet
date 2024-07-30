export function tellMeWhatYouKnow() {
    const sayings = [
        "What's the closest thing in this topic that makes complete sense to you?",
        "What's the closest thing you understand around this topic?",
        "What are you confident about so far in this topic?",
        "Can you describe what you've grasped so far in this topic?",
        "What part of this topic do you feel you understand best?",
        "Tell me a fact you understand within this topic!"
    ]
    const randomSaying = sayings[Math.floor(Math.random() * sayings.length)];
    return randomSaying;
}

export function oopsThatsNotQuiteRight() {
    const sayings = [
        "What's a different fact you've got?",
        "What else do you know about this?",
        "Got another fact you can share?",
        "What's another fact you recall?",
        "What's another fact you understand about this topic?",
    ]
    const randomSaying = sayings[Math.floor(Math.random() * sayings.length)];
    return randomSaying;
}