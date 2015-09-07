```
  _________ __         .__                                  
 /   ______/  |________|__| ____   ________________  ___.__.
 \_____  \\   __\_  __ |  |/    \ / ___\_  __ \__  \<   |  |
 /        \|  |  |  | \|  |   |  / /_/  |  | \// __ \\___  |
/_______  /|__|  |__|  |__|___|  \___  /|__|  (____  / ____|
        \/                     \/_____/            \/\/     

```

This is my personal blog, there's probably not much to do with it -- however it's mainly db driven and probably pretty easy to setup for yourself. It's highly likely to constantly have breaking changes. Uses Node.js, Express, Mongoose, Marked, and Passport under the hood. If you use it and notice something I should fix, submit an issue or even better -- pr <3

##Docker Steps

### Dev mode
```sh
$ docker build -t lsrting-dev .
$ docker run -p '3000:3000' -v /apps/node/laserstingray:/apps/node/laserstingray/apps -it --rm --name lsrs lsrting-dev
```