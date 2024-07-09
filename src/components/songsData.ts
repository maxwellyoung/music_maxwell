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
    artwork: "/artworks/Dread.webp",
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
  {
    title: "Only Romantics",
    artist: "Maxwell Young",
    artwork: "/artworks/OnlyRomantics.webp",
    links: {
      spotify:
        "https://open.spotify.com/album/3x3tbBAQoCxTHKWMZeVIdZ?si=otfnk5hwSQ-kAlTwxwtrvA",
      appleMusic:
        "https://music.apple.com/us/album/only-romantics-ep/1462528934",
      youtube:
        "https://www.youtube.com/playlist?list=PLUUI0ZZx_T8cGcP8Ewu9yzZnK-hezT_F5",
    },
    lyrics: {
      Princess: `Princess
How you soften voices
Laying still your choices
Lover, you’re too gorgeous

I don't feel a thing but
Dear how I miss
Our times on your window
Elation morning cyclical

Voices in my head
Loop assorted phrases you have said
Darting back my mind into memories all divine with you`,
      "Kindred Spirits": `Always cry on aeroplanes
Look in silence, know I'm dazed
Tonight in the room
Face distract all the gloom
Ain't really special if I hesitate
Can't hide that I'm stilled by you; meditate
Can't fathom how I never can communicate
Heard you say you've seen better days

I don't know what
You don't know when
What are you living for
A chronic for it all
(I love you everyday, I love you every way, I love you)

Trying to move to big apple
But my money been froze
Sometimes see right through
Whilst my heart is on hold
Claimed I don’t care
Living out a tote bag
Head down
Because my heart is on froze
Steel string, girlfriend in her head
Noises shameless, painless

Pretty language has purpose
Can't forget I serve a purpose
Forget a lot, forget it all
Mountains make it tall
Butterflies in my eyes and the fears all gone
Love hear my love on the phone
Career mean I'm never at home
With money only make it alone

Everybody scared
Can't live without fear
While you're here
Hold my hand

What have you got to say?
I need more than your embrace
I need trust
What have you gotta say
It's not easy anyway
I need love

I don't know what
You don't know when
What are you living for
I'm a chronic for your love
(I love you everyday, I love you every way, I love you)`,
      "Sketches of Dragonflies": `Vapour doesn't last
My tongue is not so fast
In person I collapse
Entwined I’m a mess

Don’t act like it’s same since day one
More honest with sauvignon blanc
“Don’t tell me about your time spent wandering”
I was on the road
It’s alright sometimes
(Get out my face, get out my place)

Honey, why're you always talking about the fools, the drama?
I need karma for my good deeds sometimes

It’s a risky thing
Closing your eyes
Kissing mother goodbye
Closing your eyes

Just call me up
It’s not that I am lost in love no more
Still get stuck
Lost in love no more
(I like knowing you don't need me
I like knowing you're not there
Reappear, euphoria blares)

Am I out of luck
For feeling firm that two's enough
Agonise two dragonflies
I'm sketching all the time

Cindy, am I dying?
Stars, I’ll try defy them
Dreaming, I’m not crying
Let me feel alive again

Cindy said I'm faking
These maladaptive daydreams
Hypochondriac
Is romance in our waiting

Just call me up
It’s not that I am lost in love no more
Still get stuck
Lost in love no more

Cindy, am I dying?
Stars, I’ll try defy them
Dreaming, I’m not crying
Let me feel alive again

Cindy said I'm faking
These maladaptive daydreams
Hypochondriac
Is romance in our waiting`,
      FFWD: `What do you got to be nervous for?
Do you think she’ll runaway?
What you feel like drowning for?
Little louder when you say
Timings all wrong
Cry on shoulder
Writing, I’m gone
Feeling sorry for myself

Out of luck, giving up from signifiers
Not enough being with you off desire
Can I find my speech?
Can I tell the truth?
The weight of being with you

Wish I could fast forward
Out the moment
At least now
I'm not hopeless
But the moments been feeling helpless
Denying things you say

Wish I could fast forward to New Years Eve
Fireworks when you’re looking at me
Want to fast forward all of the screams
In my head

What do you got to be nervous for?
Do you think she’ll runaway?
What you feel like drowning for?
Little louder when you say
Timings all wrong
Cry on my shoulder
Writing, I’m gone
Feeling sorry for myself

It's not like I've had love to judge
How much of me I should share
Say I'm unaware
Then let me out your way
The gravity
It's not like you shut it off
One of these days you've got to come around

Wish I could fast forward to New Years Eve
Fireworks when you’re looking at me
Want to fast forward all of the screams
In my head

What do you got to be nervous for?
Do you think she’ll runaway?
What you feel like drowning for?
Little louder when you say
Timings all wrong
Cry on shoulder
Writing, I’m gone
Feeling sorry for myself

(Yeah, yeah)
I'm done waiting in the cold (yeah)
I'm done waiting in a hole (yeah)
I'm done waiting in the cold (yeah)
I'm done waiting waiting in the

I'm done waiting in the cold (yeah)
I'm done waiting at my home (yeah)
I'm done waiting for you (yeah)
Tell me

I'm done waiting in the cold (yeah)
I'm done waiting at my home (yeah)
I'm done waiting for you
For you`,
      "Popstar's Girlfriend": `Think I'm playing dead
I don't know my head
You know how I get
I been tripping every second step
Eye dart when I'm scared

Popstars girlfriend
Blue tint
Whirlwind down
Popstars girlfriend
Popstars, popstars

Sleep call round three
In dreams don't bleed
Doubt called round one
A time I can't run

I get depressed
I don’t know why
Girlfriend, girlfriend
I get depressed sometimes
I'm hoping that you'll understand
I'm hoping that you know
I'm here`,
      Forevermore: `It's not what I'm looking
When I walk out the door
I lose my face & all
It's not what I found
Your love, your love

Your love, love, love, love, love, love, love, love, love, love
Your love, love, love, love
Your love, love, love, love

You know I can't keep turning out the lights
Without a fight
You know I can't keep turning
Turbulence makes me cry

Its not what I'm looking
When I walk out the door
I lose my face & all
It's not what I found
Your love, your love

Loves not like that
Wish it didn't hurt so bad
Heart on my sleeve
Forevermore

Its not what I'm looking
When I walk out the door
I lose my face & all
It's not what I found
Your love, your love

I crave more
Thought about you once or twice
Been here forevermore`,
    },
    credits: `Written/Produced/Recorded/Mixed/Performed by Maxwell Young
    Artwork by Max Pirrit & Ilena Shadbolt
    
    Co-Production on 'Princess' by Sasha Daze
    Additional Vocals on 'Kindred Spirits' by seungjin
    Additional Vocals on 'Forevermore' by Xandre Frederick
    Saxophone on 'Forevermore' by Theo Hertzig`,
  },
  {
    title: "Daydreamer",
    artist: "Maxwell Young",
    artwork: "/artworks/Daydreamer.webp",
    links: {
      spotify:
        "https://open.spotify.com/album/1TNWD3no292fUChXiTqxsX?si=pOooW-_wTOm6TDVNHMf1kw",
      appleMusic: "https://music.apple.com/nz/album/daydreamer/1417117886",
      youtube:
        "https://www.youtube.com/playlist?list=PLUUI0ZZx_T8f--xayoxSRsF77weAjMopb",
    },
    lyrics: {
      "1999": `1999 was the year that I arrived
Same year I met you
Guess we've been in this for a while
Of you my eyes never tire

She can’t tell me how to live no more

Left your boyfriend with a scar
In shattered pieces left my heart
Staying in, my curtains shut
Avoiding what was scaring us

She can't tell me how to live no more

How can I reply with more than i’m fine
When you project all your problems and perceptions on my life
Damn life

I was down and out
Told my friends to call
No one was listening
Thought there is where I end

One day you popped up
A sunflower in the dusk
I didn't think it was much
But you became my all

Put all my hope in us
All my happiness
Yet neither of us were at our bests
At rest

I’ve never been love like I am with you
But it's not enough to stay miserable

I gotta get away, get away
Girl nothing makes me sane
I gotta get away
There’s nothing else

Ahh
If I stick with it I know I’m gonna lose it
Know I'm gonna lose them

Hair braided
Cross faded
Both waiting on the other
Bet I'm cutting ties
With everyone else

She can't tell me how to live no more`,
      Bianca: `Found you in your Calvin Klein's
      Wouldn't let me know if I'm right
      Never been the one for small talk
Keep on postponing most my problems

But the moment wasn't set in stone
It's more that I'm not warm in tone
Who's more broken can't you see
Won't take my hand can't start with me

I heard one little promise and
I'm bursting at the seams
Never thought you'd help me more
Am I ever coming clean
I thought you knew where I was headed for
They're taking selfies in the bathroom

I had one little promise
And I'm bursting at the seams
Aaoo
Selfies in the bathroom
You doubt it cause it's too soon
It's too soon

Bianca, do I love ya?
Might've fallen little too quick for you
But I never thought you'd hold me back so
But I never thought you'd hold me back so much
Always in a different place
My ship fly to space
I never come back too much
Now we runaway
Better runaway
Now we runaway
Living for today

I don't want to keep on playing games
Thank the lord you stopped
That was quite a pain
Often left me questioning
Was it passion that brought you to my door
Every Saturday

"Just cause you're beautiful doesn't mean you can treat people like they don't matter, I really liked you"

I heard one little promise and
I'm bursting at the seams
Never thought you'd help me more
am i ever coming clean
I thought you knew where I was headed for
They're taking selfies in the bathroom

I had one little promise
And I'm bursting at the seams
Aaoo
Selfies in the bathroom
You doubt it cause it's too soon
It's too soon

Would you mind if I took your hand
Know you got things planned
But your smile says you want golden sand
Smile says you want golden sand
Agreed, putting this on you was unfair
You're not Tiffany I won't overbear

Broke your promise
But who am I to feel discouraged
For you aren't in a cage
And that's enough for me

Who would you follow to the ends of the earth
I think I broke it when I took my turn
Where is my worth
How much of my worth is in you

Who wasted the boys time
Blame it on myself
So I'm nothing
Can't help it`,
      Evergreen: `After nine
I plan to share my mind
Girl I try
Yet I can't find the words

I tell you once
We put it all behind
Both stubborn types
Neither care to draw the line

Tell me I'm the one for you
Girl there's none other than you
You don't need my trust
But if I could I'd be there for you
Be there and true

My love is strong
Might not be enough
But I’m young
And I can't find the words

In my mind
You're flashing all the time
Before my eyes
You sway from left to right
In black and white

Tell a lie
Say goodbye
Because I'm walking out
But we laughed all night
And I want you around
Really want you around
I'm a fool for you now

(Now evergreen)
Tell me I'm the one for you
Girl there's none other than you
(All I need)
You don't need my trust
But if I could I'd be there for you
Be there and true

My love is strong
Might not be enough
But I’m young
And I can't find the words

(Tell me I'm the one)
Evergreen
You're a little out of reach
(Tell me I'm the one)
Finding your face can be tough
So I pretend reflections are enough
No, they're not enough`,
      "No Social Butterfly": `My hearts still aching
      Angel, why we waiting?
Skin liberation
"Well can't we date then?"
Know that nobody really got my back
I'm feeling sick, out of breath
I’m loving the stress
Her lips on my neck
See the colour of her iris
Want to dive in
Take my time, sin
Predicting sinking all our time together
Confliction, we linking through the weather

Everybody's tryna impress someone
I put my hands in the air like it's nothing
It's nothing new

You're putting all your penny’s on a shot in the dark
Just wanna blink to feel alive without crashing your car
It's all overrated
It's all overrated
Imagine colours in sleep
Lovers at peace
I just want a world where I can wander nights forever with you

Can’t decide if you’re making up your mind
Are you really one for walking
Leaving here without him
Leave him all alone
He don't have to know
Do you feel like a cliché
Making moves so risqué
Honey just try to have no fear
Have no fear

It’s still like that
You’re running back
Running back

Everybody's tryna impress someone
I put my hands in the air like it's nothing
It's nothing new

Feeling failure like it’s something you caught
Tryna to keep a secret but its in the way that you walk
whats your motivator?
Well i’ve been sick for the sun since 99
Always feeling sporadic, is it visible in my eyes?

It’s all a loop
Live for dreams
Your television leaking
Only thing that fits me
Saint Laurent jeans
I’m just not happy from these things no more

If you wanna stop feeling so empty
Wanna stop feeling things are all out of reach
Go ask yourself if passions fell
Wouldn't wanna go turning your back on real

Where your head at?
It’s raining on my bare back
People saying you're little unaware max
Social butterflies only try when inspired
Staying patient shooting stars in the sky

Everybody's tryna impress someone
I put my hands in the air like it's nothing
It's nothing new

All of that weight fell off my shoulder
Still clutch pride in getting older
18 years, the doubt is torture
I just wanna feel`,
      "Worth / Gotta Get Away": `Always seem to leave a mess
      Doubt I can bother with the stress
I need to get some more rest
Am I worth it?

Do you think that you're worth it?
(No more)

Are you gonna flake once more
I been waiting on you too long
Am I better off alone

Why would I lie to you
Nothing more true
I'm not gonna lie to you
And I mean every word
You deserve it

I'm not gonna lie to you

Because can't make one more mistake
Spent too long taking pain
How could I let you take my heart

How can I ride
Without my helmet
Safety slipped my mind
Naivety surrounding
I'll follow you

Do you think that you're worth it?
(No more)

Gotta get away
I gotta get away
Gotta get away, no no
I gotta get away
No one's listening to me anyway
But I gotta get a

No
I gotta get away
Away from this here
But stilted anyway
I gotta get away
Away from this here
But I stilted anyway
Better off alone
I'm better off alone
I'm better in my zone
I'm better off alone
Lucky is a word
Not many people can say`,
      "	L'appel Du Vide": `AAdolescent me
That heartbroken sheep
Tempting my breath
For your butterfly net
Up by those treetops
i wandered every evening
i watched the moon wane breathing
Thought one day you treat me right
Typing to myself
Just one inhale
You said I stared
I just laughed then left
Overwhelmed I guess

L’appel du vide
Look over the edge
L'appel du vide
Don’t wanna get upset

Stepping my way
It’s not what you said
It’s not how I play, baby
If you want more I can assure loyalty
It’s all i do
Is wait for you
But baby girl
I’m not strong enough
But I'm just not strong
And I been waiting all long
She took me down
And she brought me around
We went to our spot
Blew smoke like movie stars
I don't know why baby girl
I don't know why, not at all
I just lose my mind
I lose it time to time
As mindful as the world
My trying feels absurd
You talk to me
You're flying out soon
Paint my heart blue
Pastels remind of you
And how I wanted you

L'appel du vide
Look over the edge
L’appel du vide
Don't wanna get upset

Voice memo of Ch'lita`,
      "Midnight (feat. Claire Cottrill)": `Lose you in a moment
Will I lose you when it's midnight?
Just might

I don't wanna do it no more
It's not that I'm antisocial
I wonder what i’d have to do for it to be enough
For you to show your true heart
I know how you feel
Present from the break of dawn
Ache from wanting
You been toying
It got boring
If I took on my arm
Would i lose you?


Clairo:
Country side
I’m by your side
It’s so hard to get by
Without you
Without you

Cross the line
My tears are dry
I see you in my hairs by my side
I miss you so much
I need you
It's not fair for those ones
Who have a heavy heart
But me it’s daylight here
And there it’s dark
Oh it’s dark

I know how you feel present from the break of dawn
Ache from wanting
You been toying
It got boring

If I took you on my arm
Would I lose you?

So i guess I lost you
Do do do do do dooo
Oh love you’re so far away
I just want you back
I don’t need a casket of love
Casket of love

Do you wanna come round
I got a lot to tell you about
Do you wanna come over
Got a spot for you on my shoulder

We got a secret I can keep
We got a lot to learn and leave
And I won't follow anyone but you`,
      Goldeneye: `Goldeneye
You’re all too nice

Let’s fall in love
Done wasting time
All I want, all on my mind
Rush more than we've been so far
Before we know our youth will be gone

Don’t leave me lovelorn
You’re all too nice

Let’s get married on a monday morning
Who can waste the weekend by
How you smile so often
First felt love for the world through your eyes

Why’re you shrugging off romance
When I should just be your man
I don’t know
I wouldn’t be so alone

Walking up
Walking up
Such an angel from above

Don’t need nobody
I just need somebody to come home`,
      Daydreamer: `I don't understand fashion
So I wear plain tees
Don't understand love
So I'm all alone
But I try
I try all the time

I'm working on being better at being me
But who is that
Well I can't see
I'm just confused
Not amused
Deeper into
Something brand new
It's alien, alien to me

But I can't see anything
Worth following here
I can't see anything
Worth following
Of course I see you there
Of course I see you dear
But really I'm just scared
To understand love
I don't understand

I don't understand love
I don't understand much
But I'm searching
Still searching for someone

You are what you love and ain't what loves you
Listen up
You are what you love but ain't what loves you
(Don't let them tell you what they think you are)
I don't understand love, no no
And I'm searching for someone

I can't stand on what's not there
I don't know I just get scared
You're always on my mind
But forever's not our time

Until I realised I don’t understand myself
And I’m not one to ask for help
I was lying on my bed
So overcome with dread
Do you know me?
Do you know my daydream?
I really don't mind
Just stay with me a while`,
    },
    credits: `Written/Produced/Performed by Maxwell Young
    Artwork by Ch'lita Collins
    
    Additional Vocals on 'Evergreen' by Eddie "Lontalius" Johnston
    Additional Production on 'Evergreen' by Aidan "Instupendo" Peterson
    Additional Vocals on 'No Social Butterfly by Ambré
    'Midnight' featuring Claire "Clairo" Cottrill`,
  },
];

export default songs;
