// For more information about this template visit http://aka.ms/azurebots-node-qnamaker

"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var builder_cognitiveservices = require("botbuilder-cognitiveservices");
var path = require('path');

var useEmulator = true;

var connector = new builder.ChatConnector();


/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

var bot = new builder.UniversalBot(connector);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.post('/api/messages', connector.listen());    

    server.listen(3978, function() {
        console.log("using emulator");
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
} else {
    module.exports = connector.listen();
}

bot.dialog('/', function (session){
    var qnaKnowledgebaseId = process.env.QnAKnowledgebaseId;
    var qnaSubscriptionKey = process.env.QnASubscriptionKey;
    
    // QnA Subscription Key and KnowledgeBase Id null verification
    if((qnaSubscriptionKey == null || qnaSubscriptionKey == '') || (qnaKnowledgebaseId == null || qnaKnowledgebaseId == ''))
        session.send('Please set QnAKnowledgebaseId and QnASubscriptionKey in App Settings. Get them at https://qnamaker.ai.');
    else
        session.replaceDialog('basicQnAMakerDialog');
});


