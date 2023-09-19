async function createCompletionTest(prompt: string) {
  let text: string = "";
  interface Choice {
    message: {
      role: string;
      content: string;
    };
  }

  let prevChoices: Array<Choice> = [];
  const allChoices: Array<Choice> = [
    {
      message: {
        role: "user",
        content: "What was the French Revolution?",
      },
    },
    {
      message: {
        role: "assistant",
        content:
          "The French revolution in 1789 to 1799 involved the overthrowing of the absolute monarchy, establishing a republic, fundamentally shifting the power structure in France.",
      },
    },
    {
      message: {
        role: "user",
        content: "sparked major political and social changes - How?",
      },
    },
    {
      message: {
        role: "assistant",
        content:
          "It caused major political changes because it overthrew the absolute monarchy and established a republic, fundamentally shifting the power structure in France.",
      },
    },
    {
      message: {
        role: "user",
        content: "republic - What?",
      },
    },
    {
      message: {
        role: "assistant",
        content:
          "What is your best guess for what republic means? I’ll fill the gaps.",
      },
    },
    {
      message: {
        role: "user",
        content: "A group of people.",
      },
    },
    {
      message: {
        role: "assistant",
        content:
          "Great guess! A republic is a group of people who are elected to represent the nation's views and govern on behalf of the citizens.",
      },
    },
  ];
  switch (prompt) {
    case "What was the French Revolution?":
      text =
        "The French revolution in 1789 to 1799 sparked major political and social changes.";
      prevChoices = allChoices.slice(0, 1);
      break;
    case "sparked major political and social changes - How?":
      text =
        "It caused major political changes because it overthrew the absolute monarchy and established a republic, fundamentally shifting the power structure in France.";
      prevChoices = allChoices.slice(0, 3);
      break;
    case "republic - What?":
      text =
        "What is your best guess for what republic means? I’ll fill the gaps.";
      prevChoices = allChoices.slice(0, 5);
      break;
    case "A group of people.": //strip q marks in their answer.
      //this is a correction. questions which are correct first time reply 'CONCEPT_UNDERSTOOD'
      text =
        "Great guess! A republic is a group of people who are elected to represent the nation's views and govern on behalf of the citizens.";
      prevChoices = allChoices.slice(0, 7);
      break;
    //THEY CLICK UNDERSTAND
    case "REPEAT_LAST_STATEMENT":
      text =
        "It caused major political changes as it overthrew the absolute monarchy and established a group representing the nation's views, governing on behalf of the citizens, shifting the power structure in France.";
      prevChoices = allChoices.slice(0, 9);
      break;
  }
  await new Promise((r) => setTimeout(r, 2000));
  console.log("Mock delay complete, returning completion");
  //a mock response from the API
  return {
    givenPrompt: prompt, //use this to fill enquiry field
    id: "chatcmpl-123",
    object: "chat.completion",
    created: 1677652288,
    model: "gpt-3.5-turbo-0613",
    choices: [
      ...prevChoices,
      {
        message: {
          role: "assistant",
          content: text,
        },
      },
    ],
    usage: {
      prompt_tokens: 9,
      completion_tokens: 12,
      total_tokens: 21,
    },
  };
}

export default createCompletionTest;
