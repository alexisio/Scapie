# Scapie

## Overview

Scapie is the official Discord bot for the upcoming Scapers project. He is built using `discord.js` and is `Node` based.

The idea is to keep the bot simple, with most data processing occuring via an Express API call. The bot should do no more than
pull the neccessary data from his Restful API and format it for posting to Discord.

All posts to Discord should keep mobile users in mind. This means avoiding the use of wide tables and such. Where possible, Scapie
tries to post via `RichEmbed` rather than code blocks or plain text.

Scapie does not currently support sharding or server by server settings, but the plan is to add these in the future. Ultimately, he will
need to be able to have a configuration for each `Guild` he is invited to. This is important so the server admins can set their clan settings to allow Scapie to know where to tie his clan based calls to.

## Commands

### User

User commands can be executed by anyone on the server.

#### Lookup

*Stats - Get a user's stats*

>Usage:   `!stats <username> [#<skill>]`
>
>Aliases: `hiscores`


*Alog - Get a user's RuneMetrics event log*

>Usage:   `!alog <username>`

*Price - Get the item's current GE value*

>Usage:   `!price <itemName>`
>
>Aliases: `ge`

#### Rotation

*Vorago - Get the Vorago rotation for today or specified day*

>Usage:   `!vorago [<lookupDate>]`
>
>Aliases: `rago`

*Rots - Get the RoTS rotation for today or specified day*

>Usage:   `!rots [<lookupDate>]`

*Araxxor - Get the Araxxor rotation for today or specified day*

>Usage:   `!araxxor [<lookupDate>]`
>
>Aliases: `rax`

*Spotlight - Get the spotlight for today, a specified day, or the next instance of a specified minigame being spotlighted*

>Usage:   `!spotlight [<lookupDate> or <lookupMinigame>]`
>
>Aliases: `minigame`, `minigames`


#### Distraction

*Viswax - Get the current vis wax combo per Vis Wax FC*

>Usage:   `!viswax`

*Warbands - Get the next Warbands*

>Usage:   `!warbands`
>
>Aliases: `wbs`


#### Skilling

*Vos - Get the current Voice of Seren*

>Usage:   `!vos`

*Portables - Get most recent Portables FC call*

>Usage:   `!portables`
