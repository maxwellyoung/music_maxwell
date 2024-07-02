export type Song = {
  title: string;
  artist: string;
  artwork: string;
  links: {
    spotify: string;
    appleMusic: string;
    youtube: string;
  };
  lyrics?: Record<string, string>;
  credits?: string;
  videoLink?: string;
};

const songs: Song[] = [
  {
    title: "Freewheelin'",
    artist: "Maxwell Young",
    artwork: "/artworks/Freewheelin.webp",
    links: {
      spotify:
        "https://open.spotify.com/track/0h3h7w0j3g3k2k3j2j1j0j0j0j0j0j0j0j0j0j0",
      appleMusic:
        "https://music.apple.com/nz/album/freewheelin-single/1713764743",
      youtube:
        "https://www.youtube.com/watch?v=Q-cp7oA-gwI&pp=ygUYaSBqdXN0IHdhbm5hIGZseSBtYXh3ZWxs",
    },
    lyrics: {
      Freewheelin: `Laying back with you
I wanna do it all the time now
Why’s it what I do and what I say is not the same thing
Wasn’t looking for it but then I saw it on my front porch
I was not the same as before

I don’t know what you’re looking for
I don’t know what you’re looking for
But I get up I put on my jeans
I get up I beg on my knees

We’re walking arm in arm I feel like Bob Dylan on Freewheelin
Quit covering my eyes now by your side I’ll just try living
Every morning curtains open up to brand new new feelings
Record scratch you’re wondering how I got here, I just dived in
What I got with you they don’t need to know some things are private
And now I care so I grab it all

Know it’s not the way that we both wanted it to go
But I’m not as happy on my own now you’re my girl

You know what I’m talking about
Cause you know you’re quite the view
You know what I’m talking about
When I’m naked all on you
You know what I’m talking about
Cause I do it just for you

You know I’m saying
You know
You and me we could go places
I’m saying
You know what I’m saying
You know what I’m saying
Just you and me we could go places
I’m saying
You know I’m saying`,
    },
    credits: `Produced by Maxwell Young & Eddie Johnston
    Artwork by Maxwell Young`,
    videoLink: "https://www.youtube.com/watch?v=KYIs2B03fuY",
  },
  {
    title: "I Just Wanna Fly",
    artist: "Maxwell Young",
    artwork: "/artworks/IJustWannaFly.webp",
    links: {
      spotify:
        "https://open.spotify.com/track/7yBIX3tGrBzYOYFpVw7KhQ?si=5fe8124622c74381",
      appleMusic:
        "https://music.apple.com/nz/album/i-just-wanna-fly-single/1713764743",
      youtube:
        "https://www.youtube.com/watch?v=Q-cp7oA-gwI&pp=ygUYaSBqdXN0IHdhbm5hIGZseSBtYXh3ZWxs",
    },
    lyrics: {
      "I Just Wanna Fly": `We’ve both been here before
  Each time left me alone
  I wanna see you wake
  I know you wanna wait for some time
  I started losing sense
  I started losing faith
  I thought you'd be the one
  I thought you could stay
  Forever
  Won't you just hold me still
  You leave me in a rut
  You leave me in the wings
  You leave me in denial
  You left me on my own
  Try walk out all the doors
  Try walk out of your heart
  Try walk out of this place
  I knew this from the start
  You were always
  Good for a rhyme
  Turned on a dime
  Made me feel helpless
  And somehow sublime
  Made me feel warm
  Had me on your arm
  Wherever we’d roam
  Making me whole
  Made it feel home
  Bringing me up
  And letting me through
  I just wanna fly
  I want to show you
  Ooo
  I just wanna fly
  I wanna be there
  Ooo`,
    },
    credits: `Produced by Maxwell Young & Eddie Johnston
    Artwork by Tom Shackleton & Maxwell Young`,
    videoLink: "https://www.youtube.com/watch?v=Q-cp7oA-gwI",
  },
  {
    title: "Hopeless",
    artist: "Maxwell Young",
    artwork: "/artworks/Hopeless.webp",
    links: {
      spotify:
        "https://open.spotify.com/track/3uFLa70uqobRBUp0fJWCET?si=b5b728d5793d4a71",
      appleMusic: "https://music.apple.com/nz/album/hopeless-single/1709517721",
      youtube:
        "https://www.youtube.com/watch?v=joqiWu97IXk&pp=ygUWaG9wZWxlc3MgbWF4d2VsbCB5b3VuZw%3D%3D",
    },
    lyrics: {
      Hopeless: `We were so close
      Know it’s been over a year
      I’d see your face
      And then I’d know I’m not scared
      I wanna love you but I’m not prepared
      I wanna tape over my eyes and go to bed
      It’s not with most I can be intimate
      Get home from work and we would take off our shirts
      Memories too good that now it really just hurts
      I think I’m ready but I’m really not
      
      Girl I’m hopeless
      City makes me wild
      Girl I’m hopeless
      
      I took my chances
      Just to get back my heart
      Got back together
      Just to end up where we’d start
      How natural is it to just to really not care
      Don’t know what you see in him
      Just hope he acts fair
      Run out of options
      Still I go back for more
      I wanna tell you
      But what would that be for
      There must be someone else
      I’m really not sure
      I think I’m ready but I’m really not
      
      Hope when you go running you’ll still call me up fast
      Hope you know I'm learning everything don't last
      Hope you know I'm good with everything that you want
      I'm just a child sometimes it gets me down
      
      Girl I’m hopeless
      City makes me wild
      Girl I’m hopeless
      I am such a child
`,
    },
    credits: `Produced by Maxwell Young & Eddie Johnston
    Artwork by Millie Dow`,
  },
  {
    title: "Call Ur Name / Go Ahead",
    artist: "Maxwell Young",
    artwork: "/artworks/CallUrName.webp",
    links: {
      spotify: "https://open.spotify.com/track/3",
      appleMusic: "https://music.apple.com/track/3",
      youtube: "https://youtube.com/track/3",
    },
    lyrics: {
      "Call Ur Name": `[Verse 1]
        Guess what
        I think you're wicked
        You’ve got me singing something special for ya girl
        You know I won't forget it
        
        [Pre-Chorus]
        And guess what
        Girl, I think you're wicked
        Running back the page just to say this
        I think you're wicked
        
        [Chorus]
        I love to call your name
        I love to call your name
        I love to call your name
        Oh Delilah
        I love to call your name
        I love to call your name
        I love to call your name
        Oh Delilah
        
        [Post-Chorus]
        Just don't you
        Just don't you
        Just don't you
        Let me go
        Just don't you
        Just don't you
        Just don't you
        Let me go
        
        [Verse 2]
        Guess what
        I'll be your secret
        You've got me spinning carousel
        Under spell
        I just saw you for a sеcond
        
        [Pre-Chorus]
        And guess what
        Girl, I think you're wicked
        Running up thе stairs to your apartment
        I won't forget it
        
        [Chorus]
        I love to call your name
        I love to call your name
        I love to call your name
        Oh Delilah
        I love to call your name
        I love to call your name
        I love to call your name
        Oh Delilah
        
        [Post-Chorus]
        Just don't you
        Just don't you
        Just don't you
        Let me go
        Just don't you
        Just don't you
        Just don't you`,
      "Go Ahead": `[Verse 1]
      You won't let mistakes pass, hate the way I act
      I was tryna taste life being with my friends
      Last night didn't realize what you couldn't stand
      Harder when you don't talk about it plain and dumb
      I think I'm at the age I need to go where I want
      I think I'm not who you want me to be
      Of course, I tried to please you
      Wish I could've done
      Say you'll cut it off then
      
      [Chorus]
      Go ahead with it
      Go ahead with it
      Go ahead with it
      Go ahead with it
      
      [Verse 2]
      I can't figure out if who you see in me is real
      Your ultimatums ruined our fairy tale
      Can't kick me out of your life 'cause how serious you say it when you want me
      Should get me out of your lifе but you're worried how you'll manage whеn you lose me
      But don't you think I'm tired of the "you should've known"s
      We were more than the sum of our parts, where'd that go?
      No more eternal sunshine laying in the snow
      
      [Breakdown]
      You're telling me today I'll never grow up
      Asking me to change, I'd rather glow
      You're telling me today I'll never grow up
      Say you'll cut it off, I'd rather go
      
      [Chorus]
      Go ahead with it
      Go ahead with it
      Go ahead with it
      Go ahead with it
      
      [Outro]
      All the things I said, wish I never said
      All the things you meant, wish you never meant
      All the things you know, I already know
      All the things you wrote, I already wrote`,
    },
    credits: `Produced by Maxwell Young & Eddie Johnston
    Artwork by Eddie Johnston`,
    videoLink: "https://www.youtube.com/watch?v=8xyT0yHmvXg",
  },
  {
    title: "Birthday Girl",
    artist: "Maxwell Young",
    artwork: "/artworks/BirthdayGirl.webp",
    links: {
      spotify:
        "https://open.spotify.com/album/59B9dUKtmzo3X2GOXyzRbo?si=f6a7c98354ea403a",
      appleMusic:
        "https://music.apple.com/nz/album/birthday-girl-ep/1640587731",
      youtube:
        "https://www.youtube.com/playlist?list=PLUUI0ZZx_T8cOu1MOU3QsjbcRaPXXQwqS",
    },
    lyrics: {
      "My Lovely Liar":
        "I’m wishing it were twilight\nYou look fine china\nLook up at faded skylines\nOh, who’s my lovely liar?\nOh, who’s my lovely liar?\n\nI'm breaking in and\nYou don't got the wings\nIf I dared for it\nAnd I can't handle it\nAnd I tried so much\nYou're all that I had\nAnd now it's too much\nOh baby it's still\nAnd I’ve been drowning for some time\nOh for some time\n\nSit beside each other\nSee the colours of us\nThere is not another\nTouch and feelings erupt\n\nSing praises to summer skies\nHumidity has run us tired\nTurquoise and the movie bright\nOcean swings and sinks my kite\nBetter ways to lend a hand\nThis candlestick signified shame\nShadowboxed the birthday girl\nPonytails apart, uncurled",
      "Giving Up Again":
        "We were moving state to state back then\nYou had someone were arranged with back then\nWe were moving on\nBut I couldn't and you couldn't too\n\nAll this meaning on microphone baby\nNot taking another home baby\nIf you'd think there's nothing wrong with it\nBecause we could and we would too\n\nBlurred colour\nHover through memories of us\nMy blurred lover, blurred lover\nI try readjust\nWith blurred colour, blurred colour\nHover through memories of us\nMy blurred lover, blurred lover\nI try readjust\n\nGiving up again\nI, I, I\nI couldn’t say it to your face\nI, I, I\nI can't keep\nBreaking everything\nI, I, I\nWanted to know\nWoke up from another dream where we touched\nTo hold you dear I'm all out of my luck\nSinging about this and I'm nauseous\nBecause we could and we would to\n\nBlurred colour\nHover through memories of us\nMy blurred lover, blurred lover\nI try readjust\nWith blurred colour, blurred colour\nHover through memories of us\nMy blurred lover, blurred lover\nI try readjust\n\nGiving up again\nI, I, I\nI couldn’t say it to your face\nI, I, I\nI can't keep\nBreaking everything\nI, I, I\nWanted to know\n\nGiving up on you tonight",
      Floodlight:
        "I took you out\nTook you out\nTook you out\nWhen you wanted to run\n\nI took you out\nTook you out\nTook you out\nBeautiful when we waltzed\n\nI took you\nRight by my side\nTold you hold me tight\nWherever we walk\n\nI took you out\nTook you out\nTook you out\nWhen you wanted to run\n\nYou're the only one I don’t talk to on autopilot\nYou're the only one we never planned but it’s decided\nYou're the only one\nYou are\nYou are\nFloodlight\nWherever you are\nFloodlight\nWhen you're on my arm\nFloodlight\nWherever you are\nFloodlight, floodlight\nWherever you are\n\nWe talked about\nTalked about\nTalked about\nHow you love and you don’t\n\nYour pretty mouth\nPretty mouth\nPretty mouth\nWhen you’re talking in prose\n\nCut all your ties\nFeeling overexposed\nYou want more highlights\nSwear that you’re owed\n\nAnd I took you out\nTook you out\nTook you out\nWhen you wanted to go\nFloodlight\nWherever you are\nFloodlight\nWhen you're on my arm\nFloodlight\nWherever you are\nFloodlight, floodlight\nWherever you are",
      "Did You Have To Grow?":
        "Kissed me good\nMisunderstood\nIt was always gonna lead that way\nWhen I woke up\nOut of my luck\nIt was always gonna lead that way\nBetty and I are trading glances\nDon't think that she's felt romance yet\n\nBut did you have to grow?\nI took the picture off my wall\nDid you have to grow?\nI still miss you after all\n\nLight refracted through the window\nGlinting beautifully\nYou were sitting in the corner\nPainting abstract things\nAcrylic on the canvas colourfully dripping\nNails painted noir\nWas all I could see\nThat's all I could see\nYou & me, you & me\nJust honey tell me what\nYou been dreaming of\nI've fallen in love\nI'm overthinking touch\n(Being in my head)\nBut did you have to grow?\nI took the picture off my wall\n\nIt gets funny\nWhen the lights don't change\nYour girl don't change\nYou're in the same place\nYou're still in the same place\n\n(I don't think you really know what I'm talking about)\n\nI got a secret\nI think that planes gonna reach me\n\nI get jealous and I fuck my hand\nI am lonely\nI am honest and I'm loathful\nI get jealous and I",
      Believe:
        "Nothings wrong\nNothings right\nNothings wrong when you turn my way\nI don't know why\n\nNothings wrong\nNothings right\nNothings changed\nStill just a boy lost in your eyes\n\nI wanted take 2 in Malibu\nI wanted to see from your point of view\nWanted to take down the avenues\nWith you on my arm\n\nBut nothing made it different so im turning away\nWas nothing i could i tell you I'm turning away\nAll my life\nAll my life\n\nI want to take my love home\nI want to take my love home\n& believe\n& believe\n\nNothings wrong\nNothings right\nNothings wrong since you brought me in\nOur brief reprise\nNothings wrong\nNothings right\nNothings changed\nStill i see us walking down aisles\n\nI wanted take 2 in malibu\nI wanted your smile to feel brand new\nWanted to stride right through every room\nWith you on my arm\n\nI want to take my love home\nI want to take my love home\n& believe\n& believe",
    },
    credits:
      "Produced by Maxwell Young & Eddie Johnston\n'Floodlight' & 'Believe' co-produced by Josh Naley\nPiano on 'Did You Have to Grow?' by Solomon Gutteridge\nMastered by Ike Zwanikken\nArtwork by Tom Shackleton",
  },
  {
    title: "Cherry Pie / Lose U Too",
    artist: "Maxwell Young",
    artwork: "/artworks/CherryPie.webp",
    links: {
      spotify: "https://spotify.link",
      appleMusic: "https://apple.link",
      youtube:
        "https://www.youtube.com/watch?v=HwndSiUB6u8&pp=ygUSbm8gNSBtYXh3ZWxsIHlvdW5n",
    },
    lyrics: {
      "Cherry Pie": `[Intro]
  I feel right
  But can't decide
  If there was ever
  A light in your eyes
  I’m in the mirror
  Not in your life
  I splash some water on my face and I felt wrong (Oh no)
  
  [Chorus]
  Love you just a little like
  Black coffee and Cherry Pie
  If you want some other guy
  It's alright, it's alright
  Love you just a little like
  Black coffee and Cherry Pie
  If you want some other guy
  It’s alright, it’s alright
  
  [Verse 1]
  Hit the last stop and I'll wait for another
  Write it all night 'til the day get its colour
  I want to know
  Where do you go?
  
  [Chorus]
  Love you just a little like
  Black coffee and Cherry Pie
  If you want some other guy
  It's alright, it's alright
  Love you just a little like
  Black coffee and Cherry Pie
  If you want some other guy
  It's alright, it's alright
  Love you just a little like
  Black coffee and Cherry Pie
  If you want some other guy
  It’s alright, it’s alright
  Love you just a little like
  Black coffee and Cherry Pie
  If you want some other guy
  It's alright, it’s alright
  
  [Bridge]
  Like just a little lie
  I'm just a little lie for you
  I bet (Oooh)
  Five, six, seven, eight
  
  [Chorus]
  Love you just a little like
  Black coffee and Cherry Pie
  If you want some other guy
  It's alright, it's alright
  Love you just a little like
  Black coffee and Cherry Pie
  If you want some other guy
  It’s alright, it's alright
  Love you just a little like
  Black coffee and Cherry Pie
  If you want some other guy
  It's alright, it's alright
  Love you just a little like
  Black coffee and Cherry Pie
  If you want some other guy
  It's alright, it's alright`,
      "Lose U Too": `[Intro]
  I know what you think you see
  Watching my self diagnosis of me
  Never meant for what beholds
  Yet we confide in each others breaking walls
  I know that we're not quite there
  But a magnetism's starting to reappear
  Immature, all I can't give
  Then, honey, why can't we resist
  
  [Chorus]
  Mm, but will I lose you too?
  First time there's no pressure about a pedestal for me
  Mm, will I lose you too?
  All that I can ask is that you'll first put you, mm
  
  [Verse 1]
  Would you risk the rain fall down again because he left you hurt?
  Putting all your weight on me and hearing all your strife
  I just hope you rain on me close to each second night
  Treasure, treasure moments that we share
  I can hold them for you
  And when it's circular
  Thought we waited up too long
  
  [Verse 2]
  Take the time, honey, breathe in
  Spend less money on the weekend
  I'll make you feel satisfied
  Can't go waste desire
  Wrapped me up with your ribbon bow
  When we linked limbs and I didn't know
  I wouldn't feel right by myself
  Time by myself
  Wouldn't make sense
  After I found your glow
  
  [Chorus]
  But will I lose you too?
  First time there's no pressure about a pedestal for me
  But will I lose you too?
  First time there's no pressure about a pedestal for me
  But will I lose you too?
  First time there's no pressure about a pedestal for me
  But will I lose you too?
  First time there's no pressure about a pede-pedestal
  But will I lose you too?
  First time there's no pressure about a pedestal for me
  But will I lose you too?
  First time there's no pressure about a pedestal for me
  But will I lose you too?
  First time there's no pressure about a pedestal for me
  But will I lose you too?
  First time there's no pressure about a pedestal for me`,
    },
    credits: `Produced by Maxwell Young & Eddie Johnston
  Artwork by Maxwell Young`,
    videoLink: "https://www.youtube.com/watch?v=HwndSiUB6u8",
  },

  {
    title: "Videostar / Cleopatra",
    artist: "Maxwell Young",
    artwork: "/artworks/Videostar.webp",
    links: {
      spotify:
        "https://open.spotify.com/album/5l0XJRyLOJo6Wg1Ukr6RsP?si=c64256d576a14a46",
      appleMusic:
        "https://music.apple.com/us/album/videostar-cleopatra-single/1550140029",
      youtube:
        "https://www.youtube.com/watch?v=NPYnIg-fKTg&pp=ygUXY2xlb3BhdHJhIG1heHdlbGwgeW91bmc%3D",
    },
    lyrics: {
      Videostar: `[Intro]
        Videostar
        Drive with low effort
        I'ma [?]
        I don't wanna scare u away
        [?]
        But girl the-
        
        [Chorus]
        She's my videostar, girl, you should go (far)
        Videostar, girl, you should go
        She's my videostar, girl, you should go
        But your love was not a better time
        She's my videostar, girl, you should go (on)
        Videostar, girl, you should go
        She's my videostar, girl, you should go
        Pull me into better times, yeah
        
        [Verse 1]
        I don't need nobody
        I just need to find my way home
        Try to open google maps
        Instead I see a dead phone
        Dancing drunk to Dijon
        I've been glassy eyed & fragile
        Uh-uh, uh
        I don't need nobody
        I just need to find my way home
        Try to open google maps
        Instead I see a dead phone
        Dancing drunk to Dijon
        I've been glassy eyеd & fragile
        Uh-uh, uh
        [Chorus]
        She's my videostar, girl, you should go (far)
        Vidеostar, girl, you should go
        She's my videostar, girl, you should go
        But your love was not a better time
        She's my videostar, girl, you should go (on)
        Videostar, girl, you should go
        She's my videostar, girl, you should go
        Pull me into better times, yeah
        
        [Bridge]
        If you wanna see nirvana
        Baby, lets get home
        Case of schizophrenia
        Pour a glass of patron
        If you wanna see nirvana
        Diesel & petrol
        Darling, hold me down
        If you wanna see nirvana
        Baby, lets get home
        Case of schizophrenia
        Pour a glass of patron
        If you wanna see nirvana
        Diesel & petrol
        We'll find something
        [Chorus]
        She's my videostar, girl, you should go (on)
        Videostar, girl, you should go
        She's my videostar, girl, you should go
        Pull me into better times, yeah
        
        [Outro]
        [?]
        (She's my)
        (On)`,
      Cleopatra: `[Intro]
      "Where's that inspiration coming from?
      I don't know! I like a little edge and a little pop in my hair"
      
      [Refrain]
      I know things feel important in the moment
      Fluorescent, can't control it but we're holding on
      
      [Verse 1]
      Saw Havana then I broke it in two
      I'm singing loud, "What could I do? What could I do?"
      I can't help imprints left on my heart
      You don't seem to care, I went too far
      A love like that should not just be around
      
      [Chorus]
      I don't know what to do with desire
      But I want it loud and I want you here
      Show me the way in whenever I'm 'round
      I'm running out sometimes
      I'm running out sometimes
      And I can't fight it on my own
      (What can I do? What can I do?)
      
      [Verse 2]
      She's in my heart, she's at my place
      She's in the wrong stage
      I really can't, I wish I could
      She ain't Selena, we really collide
      I don't believe her, she's clearly beaucoup
      I'm not an actor, I promise I'd prove
      You're not the same when I tell you it's true
      Cautious about getting more intimate
      
      [Refrain]
      I know things feel important in the moment
      Fluorescent, can't control it but we're holding on
      
      [Chorus]
      I want it loud, I want you here
      Show me the way in whenever I'm 'round
      You're looking so (Cleopatra)
      So we light a fire
      And I want it now
      I don't know what to do with desire
      
      [Outro]
      Whenever I call you, you cry on my shoulder
      Just know that I'm here still, we're getting older
      If ashes smolder on champagne lake water
      Just know that I'm here still but I'm not your only one
      [?]`,
    },
    credits: `Produced by Maxwell Young & Eddie Johnston
    Artwork by Nayan Patel`,
    videoLink: "https://www.youtube.com/watch?v=NPYnIg-fKTg",
  },
  {
    title: "Dread!",
    artist: "Maxwell Young",
    artwork: "/artworks/Dread.png",
    links: {
      spotify:
        "https://open.spotify.com/track/4fcuc4RJCp2aogsSsNJDFg?si=2439c01879eb40b4",
      appleMusic: "https://music.apple.com/nz/album/dread-single/1524674904",
      youtube:
        "https://www.youtube.com/watch?v=LybW6oYjbRI&pp=ygUTZHJlYWQgbWF4d2VsbCB5b3VuZw%3D%3D",
    },
    lyrics: {
      "Dread!": `As far as I see in the low light
      As far as I see ideas
      As far as I know with emotion
      As far as I trust my fears
      I don't get luck in the low light
      I don't get love too much
      Baby you should call for a rush
      & ignore withdrawals
      Maybe you should call for a moment
      I'd rather get love from you
      Baby it's all in the motion
      I could never get right from you
      I don't know love from the low light
      It's not all you see
      Maybe you could go out or just take a walk with me
      
      With all that you've been saying
      It's clear that you care
      From morning into night
      I want you there
      Harder was the fall
      And higher the fear
      I could just wait for you again
      
      When I was in your bed
      As soon as I saw dread
      Oh, it all appeared
      
      As much as I'd love to find out
      As much as I'll be ok
      As much as I'd love to wind back
      & turn back everyday
      As much as I'd love to come down
      Like rain on window panes
      You don't have to change
      
      With all that you've been saying
      It's clear that you care
      From morning into night
      I want you there
      Harder was the fall
      And higher the fear
      I could just wait for you again
      
      & I could wait a thousand years
      Waiting your wings repaired
      & I know you don't care
      But whenever I blare
      
      When I was in your bed
      As soon as I saw dread
      Oh, it all appeared
      
      I just wanna love you
      Make it part 2
      Don't call me a stranger
      It felt sacred & patient`,
    },
    credits: `Produced by Maxwell Young & Eddie Johnston
    Artwork by Max Pirrit`,
    videoLink: "https://www.youtube.com/watch?v=LybW6oYjbRI",
  },
  {
    title: "Don't Waste Your Time",
    artist: "Maxwell Young",
    artwork: "/artworks/DontWasteYourTime.webp",
    links: {
      spotify:
        "https://open.spotify.com/track/5qWa7n31Zjh0tcEvtERuZA?si=24bfc78a23634103",
      appleMusic:
        "https://music.apple.com/us/song/dont-waste-your-time/1506799138",
      youtube:
        "https://www.youtube.com/watch?v=Ix96hzEV8Nw&pp=ygUcZG9udCB3YXN0ZSB5b3VyIHRpbWUgbWF4d2VsbA%3D%3D",
    },
    lyrics: {
      "Don't Waste Your Time": `Always unimpressed
      And I was always too passive
      You couldn't evade assuming that I was jealous
      I know what you meant
      Let's breakup before you say it
      I know it’s not the same
      Baby in other ways we could
      
      Step back
      I did it with no patience
      Step back
      I did it with no hatred
      Step back
      I did it with no heart
      I just fell apart
      Without everything you made up for me
      
      If you want we could just walk down all the tunnels that you cursed
      Buy you flowers to leave at the feet of past hurts
      If you want I'd just go down withering
      
      I felt alone
      Without you here
      Bought you earrings
      I felt desperate
      I felt alone tonight
      With everything you're sharing about me
      
      (I’m in a gold state, gold state)
      You know what I mean
      I lost the big idea
      While she's going overseas
      I had some love for you
      Lovings all I do
      Roll another zoot
      I stained these thousand shoes
      Oh no
      
      Waiting in December
      Forgiving when it’s tempting
      Silver lining my headroom
      Miss you gold and glaring
      I know what you meant
      Sometimes I still forget
      I know it’s not the same
      Baby in other ways we could
      
      (Gold state, gold state)
      You know what I do
      Shot shine midnight blue
      Felt like lovings just for fools
      Where'd it go? Where'd it go?
      Lovings all for free
      Made out I can't feel weak
      Belmond, Anna on TV I told ya`,
    },
    credits: `Produced by Maxwell Young & Eddie Johnston
    Artwork by Maxwell Young`,
    videoLink: "https://www.youtube.com/watch?v=Ix96hzEV8Nw",
  },
  {
    title: "No. 5",
    artist: "Maxwell Young",
    artwork: "/artworks/No5.webp",
    links: {
      spotify:
        "https://open.spotify.com/track/0Qxq1Nf297aBK1k8E9py5P?si=9bf7179b859b493c",
      appleMusic: "https://music.apple.com/nz/album/no-5-single/1484081346",
      youtube:
        "https://www.youtube.com/watch?v=pnlLplATAUU&pp=ygUSbm8gNSBtYXh3ZWxsIHlvdW5n",
    },
    lyrics: {
      "No. 5": `Try catch me chasing sleep
        I'll tell you openly
        I'm terrified by dreams
        I would never go casually
        Satellites smiling down on me
        
        I would never do that to another
        Take money, I cash it all out on no other
        If you take pride out of her
        You'll be dead to me
        
        Just let me try your perfume
        What you want? The chain on my neck?
        Can't we try rewind?
        Dancing in Chanel
        (We'll be dancing all evening)
        Chic chic, let’s spin round
        
        Don't blame me
        I've got nothing to show
        It's freezing cold &
        When I thought I was doomed to fail
        Followed one foot with a nail
        
        Love me right, love me long
        If you're gonna hold me right, hold me long
        Wish you good luck
        You got charm
        I'm never tip toeing
        
        Because I thought, I thought
        I had so much to say
        I thought, I thought
        Does it matter anyway?
        
        I’m a masked rider, I inhale before I flee
        (I’m so cool)
        Catch me leaving early morning while you sleep
        (What you need?)
        I know what you need, I know
        
        I need love
        I need big displays all you got
        Take a risk, lets build it up
        If seams showing we'll break it off
        
        If you're really trying to go break my heart
        You could draw rings around all my doubts
        So sentimental until we're cut off
        How you with a man with no luck?
        
        I would never do that to another?
        When you realise that I'm honest
        Wanna be my own author
        We could spend some time
        Love that was our first mess
        I had to walk out
        You had some bullshit
        That was our first mess
        I had to walk out
        It was some bullshit
        I was tired of waiting
        
        You can love but can you impress?
        I was dead and then we had sex
        Girl, you never needed me to free the wonder
        
        You never needed me
        You never needed me, no
        No, no, no
        I'll be fine now you can glow
        I'll be fine
        
        80 years in the same room
        I'm about to gouge my eyes out
        Could I get any more lonely?
        I think I'm bound to be like this for some time
        Think I'm been bound to be on my knees all crying
        I think I'm bound for this
        
        Back when you had told me
        I had a pay cheque
        I had it painless
        I had to wait for shit
        I love having you around
        But I can't do it no more
        I really like you I've found
        But I can't keep having you round`,
    },
    credits: `Produced by Maxwell Young & Eddie Johnston
    Artwork by Maxwell Young & Ilena Shadbolt`,
    videoLink: "https://www.youtube.com/watch?v=pnlLplATAUU",
  },
];

export default songs;
