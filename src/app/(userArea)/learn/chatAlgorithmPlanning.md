<!-- start lesson -->
q = the user's initial question
theirRelatedKnowledge: 
topic = createCompletion:
    We’re teaching a student. Given the question ‘What are vectors and scalars’ and
their answer to ‘what comes to mind when you think of vectors?’ being ‘an arrow pointing somewhere’, determine the name of a very small subtopic we can begin teaching them with which links to their response, in maximum 5 words.

## on send UserResponse:
  whatTheirResponseIs=createCompletion(general).initialQ = ‘’
  rksFromLesson=[]
  switch(whatTheirResponseIs){  
    case (‘WHATCOMESTOMIND_FINALANSWER’):         
        //make a knowledge point, add to pinecone and db and network, get rKs as knowledge context for whole convo, setTopic      
        trueOrCorrection = isQuestionAnswerTrueOrCorrection(message)      
        if (trueOrCorrection !== true) 
        pushNextMessageAsCorrection(threads,trueOrCorrection); 
        return;      
        K  = await createCompletion(...)      
        rKsFromLesson.push(K)      
        {2DvK} = await createVKand2DPoints(text)      
        add2DvKToNetwork({2Dvk,KType:’wellknown’})      
        topic = getTopicByJoiningWhatcomestomindWithInitialQ(initialQ,message.data) //combine original q and whatComesToMindAnswer to form a topic      
        setTopic(topic)      
        rKs = getrKForConvo()      
        getNextAnswer()  
    case(‘ENDOFTHREADQUESTION_FINALANSWER’):        
        trueOrCorrection = isQuestionAnswerTrueOrCorrection(message)         
        if (trueOrCorrection !== true) 
        pushNextMessageAsCorrection(threads,trueOrCorrection); 
        return;         
        2DvK = await createKnowledgePoint(message)        
        add2DvKToNetwork(2Dvk)         
        pushNextMessageAsCongratulateOnCorrectAnswer()   
    case(‘QUESTION’)         
        newThreadSubject = ReturnSimplifiedQFromTheirQuestion(userResponse.data)         
        createNewThread(threads,isQ,threads[threads.length].splitResponses[0],messages)
 removeLastSplitResponseBecauseAddressedAndEndThreadIfNecessary(threads)



# fn checkIfQuestionAndReturnSimplifiedQIfQuestion(text)
    simplified = createCompletion:('Simplify this question to 5 words or less: ' text)
    return simplified
# fn extractKnowledgePointFromUserQuestionAsText(text)
    K = createCompletion: 
      When teaching a student about 'Vector Basics: Arrow Representation', when you said 'Arrow direction indicates scalar quantity direction (e.g., velocity's angle).', the student reacts saying 'What do you mean 30 degrees I thought the direction would only be positive or negative'. Extract the correct part of the user's existing knowledge in terms of their response in a short sentence even if a tiny amount, in 4 words or less and straight to the point.     => “Direction as positive or negative.” Combine with metadata: “Vector basics -  Arrow Representation: Direction as positive or negative.” 
    return k
# fn getEmbeddingOfKnowledgePoint(K)
    vK = ...
    return vK
# fn getRelatedKnowledgeAsEmbeddings(vK)
    rvKsWithIDs = knowledgePointsIndex.query(vK).matches
    return rvKsWithIDs as {rvK,kIDs}[];
# fn createNewThread(rKs,threads,threadInitiatorQuestion,assistantMessageTheyreConfusedAbout,messageHistory)
    unsplitResponses = createCompletion(‘'they asked' threadInitiatorQuestion + 'to' + assistantMessageTheyreConfusedAbout + '. They already know' + rKs.join(',') + 'as reinforced knowledge. Answer their question in exact terms of their reinforced knowledge, with each sentence separated by a new line.’,messageHistory)
    t = {splitResponses: unsplitResponses.split('\n'), threadInitiatorQuestion}
    threads.push(t)
# fn getTextKnowledgeFromKnowledgePointID(_id)
    k[] = prisma.knowledgePoint.findMany({where id == _id})
    return k[]
# fn get2DCoOrdinates(vK)
    coOrds = tSNE(vK)
    return coOrds
# fn createEndOfThreadQuestion(messageHistory)
    q = createCompletion('They say they've understood what you've said. Create a quite challenging short max 12  words sentence question that's easy to understand and applied in a new context to test what they've retained. It mustn't be a yes or no question.',messageHistory)
# fn getEndOfThreadQuestionTrueOrCorrection(text)
    trueOrCorrection = createCompletion(‘In a quiz about X, they answered Y to Z. If they answered correctly, return TRUE else correct their knowledge w/ sentences split by line break and in exact terms of their existing knowledge A, B and C.’), 
    return trueOrCorrection
    if (trueOrCorrection==true) 
     extractExistingFromQuestionKnowledgeAsText(text)
      removeLatestAssistantMessageFromContentLeftToLearn(threads), if incorrect add correction[] to after threads[threads.length-1][0]
# fn getLatestAssistantMessage(threads)
  msg = threads[threads.length-1].splitResponses[0]
  return msg
# fn removeLatestAssistantMessageBecauseUnderstoodAndEndThreadIfNecessary(threads,threadInitiatorQs)
    if (threads[threads.length-1].splitResponses.length==0) threads.shift() : threads[threads.length-1].splitResponses.shift(); threadInitiatorQs.shift();
# fn plotKnowledgePointOnVisualiser(2DvK)
    e.g. canvas.plot(2DvK[0],2DvK[1])
# fn getCartesianCoOrdinatesFromEmbedding(vK)
    2DvK = tSNE(vK)
    return 2DvK
# fn splitMessageByNewLine(text)
    msg = text.split(\^ *$\) or smth
    return msg
# fn addCorrectionToThreadsOnIncorrectAnswerToEndOfThreadQuestion(threads,text[])
    forEach(text) threads[threads.length][0].push(text)
# fn addAssistantMessageToThread(threads,data,type)
    threads[threads.length-1].splitResponses.push({data:q,type:’LearningHowTheyThinkQ’})





# function getNextMessage({lastKnowledgePoint,userResponse,threads}) = { 
    contentToExtractKnlpFrom=””;
    lastAssistantMessage = threads[threads.length-1][0]
    message = {}
    knlp = {}
    switch(userResponse.type){
      case(Understood):
        contentToExtractFrom = lastAssistantMessage;
        message = {data: await createCompletion({query: createQuestionPrompt(threadInitiatingQuestion),...})};
        knlp = {
          type: 'potential',
          data: await createCompletion({query: extractKnowledgePrompt(subject,contentToExtractFrom),...})
        }
  return {message,knlp}

const knlp = await createCompletion(
 {query: extractKnowledgePrompt(subject,contentToExtractFrom),...})
if (userResponse == Understood){
  contentToExtractFrom = lastAssistantMessage;
  const q = await createCompletion(createQuestionPrompt(threadInitiatingQuestion),...)
  if (threads[threads.length-1].length ==1) threads.shift()


  I used the t-Distributed Stochastic Neighbor Embedding statistical method to reduce the user's embedded knowledge from 1536 dimensions to 2. https://www.npmjs.com/package/tsne-js