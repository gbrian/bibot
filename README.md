# BiBOT
Business Intelligence Bot

BiBOT is  a chat bot able to help you analize your data. Talk BiBOT about how are going sales and get back all the information in an comprehesive chart.

Easy drill dow/up, just say "by providers" or "what about this TravelAgency" to filter.

![whatsapp](https://raw.githubusercontent.com/gbrian/bibot/master/images/whatsapp.png)

# How does it works
BiBOT is build up in layers: **chat**, **data** and **presentation**

### Chat
Interactuates with the user. 
This layer is responsible to make BiBOT available on multiple platforms:

- Rocketchat
- Slack
- Telegram
- Whatsapp


### Data
This layer is responsible on convert user queries in data.
Initially will be using NLP to SQL to return a JSON object with:

- Query executed
- BOT explanation of the query. (e.g. returnin sales by agent) This will help when mismatching
- Data (cvs)

### Presentation

Using D3 library to build a fancy chart

Render as image on server side (kind of https://github.com/krunkosaurus/simg)
   

## References
### NLP
https://opennlp.apache.org/

### NLP to SQL
http://kueri.me/
http://quepy.machinalis.com/

### Bots
https://github.com/yagop/node-telegram-bot-api

### Chart
https://d3js.org/
http://ecomfe.github.io/echarts/doc/example-en.html

### SVG to image
https://github.com/krunkosaurus/simg
