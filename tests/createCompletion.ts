interface Behaviour {
  intent: string; //UNDERSTOOD, INCREASE_DEPTH
}
function createCompletionTest({ intent }: Behaviour) {
  return {
    id: "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
    object: "text_completion",
    created: 1589478378,
    model: "gpt-3.5-turbo",
    choices: [
      {
        text: `${
          intent == "INCREASE_DEPTH"
            ? "Some information at a higher depth!"
            : ""
        } ${intent == "UNDERSTOOD" ? "A question to test understanding!" : ""}`,
        index: 0,
        logprobs: null,
        finish_reason: "length",
      },
    ],
    usage: {
      prompt_tokens: 5,
      completion_tokens: 7,
      total_tokens: 12,
    },
  };
}

export default createCompletionTest;
