const errorCodes = {
    1: 'HowRightIstheUser failed',
    // lesson/api/PUT
    'ERR2': 'Error creating lesson - messages weren\'t provided in the IMessagesEndpointSendPayload',
    'ERR3': 'Error creating lesson - Lesson ID doesn\'t exist or doesn\'t belong to the user',
    'ERR4': 'The entered userID doesn\'t exist in the user DB.',
    'ERR5': '[/API/LESSONS/NEW] The user ID provided in the body doesn\'t match the user ID in the session. (are they trying to create a lesson for someone else?)',
    'ERR6': '[/API/LESSONS/NEW] No user ID was assed in the body.',
    'ERR7': 'They had no session server side.',
}