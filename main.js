/**
 * 1. Render songs into list
 * 2. Scroll top
 * 3. Play/pause/seek
 * 4. CD rotate
 * 5. Next/previous
 * 6. Random
 * 7. Next / Repeat when ended song
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click in list
 * 11. Save/restore current configuration of app.
 */

const APP_CONFIG = "F8-Playlist";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// UI elements
//  song name
const name = $('header h2');
// song thumb
const thumb = $('.cd-thumb');
// thumb animation
let thumbAnimation;

// song audio
const audio = $('#audio');
// cd disk
const cd = $('.cd');

// player
const player = $('.player');

// prev
const prev = $('.btn-prev');
// next
const next = $('.btn-next');

// random
const random = $('.btn-random');

// repeat
const repeat = $('.btn-repeat');

// toggle play
const togglePlay = $('.btn-toggle-play');

// play list
const playlist = $('.playlist');

// progress bar
const progress = $('#progress');

// data model and all methods, like a class App {}
const app = {
  config: JSON.parse(localStorage.getItem(APP_CONFIG)) || {},
  saveConfig(key, value) {
    // merge config with new value 
    this.config[key] = value;
    // save immediately into localStorage
    localStorage.setItem(APP_CONFIG, JSON.stringify(this.config)); 
  },  

  // states to manage current playing song
  _currentIndex: 0,
  _isPlaying: false, // but using class 'playing' on player
  _isSeeking: false,
  _isRandom: false,
  _isRepeat: false,
  _playedSongs: [],

  // auto-load config
  loadConfig() {
          this._currentIndex = this.config?._currentIndex || 0;
          this._isPlaying = this.config?._isPlaying || false;
          this._isSeeking = this.config?._isSeeking || false;
          this._isRandom = this.config?._isRandom || false;
          this._isRepeat = this.config?._isRepeat || false;
          this._playedSongs = this.config?._playedSongs || [];
  },

  // define properties for configuration and inferred attributes 
  defineProperties() {
    //  _currentIndex
    Object.defineProperty(this, 'currentIndex', {
        get() {
            return this._currentIndex;
        },
        set(value) {
            this._currentIndex = value;
            // auto save
            this.saveConfig('_currentIndex', this._currentIndex);
        }
    })
    //  _isPlaying
    Object.defineProperty(this, 'isPlaying', {
        get() {
            return this._isPlaying;
        },
        set(value) {
            this._isPlaying = value;
            // auto save
            // this.saveConfig('_isPlaying', this._isPlaying);
        }
    })
    //  _isSeeking
    Object.defineProperty(this, 'isSeeking', {
        get() {
            return this._isSeeking;
        },
        set(value) {
            this._isSeeking = value;
            // auto save
            // this.saveConfig('_isSeeking', this._isSeeking);
        }
    })
    //  _isRandom
    Object.defineProperty(this, 'isRandom', {
        get() {
            return this._isRandom;
        },
        set(value) {
            this._isRandom = value;
            // auto save
            this.saveConfig('_isRandom', this._isRandom);
        }
    })
    //  _isRepeat
    Object.defineProperty(this, 'isRepeat', {
        get() {
            return this._isRepeat;
        },
        set(value) {
            this._isRepeat = value;
            // auto save
            this.saveConfig('_isRepeat', this._isRepeat);
        }
    })
    //  _playedSongs
    Object.defineProperty(this, 'playedSongs', {
        get() {
            return this._playedSongs;
        },
        set(value) {
            this._playedSongs = value;
            // auto save
            this.saveConfig('_playedSongs', this._playedSongs);
        }
    })

    //  currentSong
    Object.defineProperty(this, 'currentSong', {
      get() {
        return this.songs[this.currentIndex];
      },
    });
  },
  // list of songs
  songs: [
    {
      name: 'Click Pow Get Down',
      singer: 'Raftaar x Fortnite',
      path: 'https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3',
      image: 'https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg',
    },
    {
      name: 'Tu Phir Se Aana',
      singer: 'Raftaar x Salim Merchant x Karma',
      path: 'https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3',
      image:
        'https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg',
    },
    {
      name: 'Naachne Ka Shaunq',
      singer: 'Raftaar x Brobha V',
      path: 'https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3',
      image: 'https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg',
    },
    {
      name: 'Mantoiyat',
      singer: 'Raftaar x Nawazuddin Siddiqui',
      path: 'https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3',
      image:
        'https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg',
    },
    {
      name: 'Aage Chal',
      singer: 'Raftaar',
      path: 'https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3',
      image:
        'https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg',
    },
    {
      name: 'Damn',
      singer: 'Raftaar x kr$na',
      path: 'https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3',
      image:
        'https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg',
    },
    {
      name: 'Feeling You',
      singer: 'Raftaar x Harjas',
      path: 'https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3',
      image:
        'https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp',
    },
  ],

  // start app
  start() {
    // -1 : Load config
    this.loadConfig();
    // 0. Define properties for object app to ease the use
    this.defineProperties();

    // 1. Render songs into list
    this.render();

    // Load the first song when app is first loaded
    this.loadCurrentSong();

    // Subcribe all event handlers
    // 2. Scroll top
    this.subcribeEventHandlers();
  },
  /**
   * render playlist from songs
   */
  render() {
    // render UI depending to config
    repeat.classList.toggle('active', this.isRepeat);
    random.classList.toggle('active', this.isRandom);
    
    // render play list
    const htmls = this.songs.map((song, index) => {
      // 8. Active song
      return `
            <div class="song ${index===this.currentIndex? 'active' : ''}" key="${index}">
                <div class="thumb" style="background-image: url(${song.image})">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>                
        `;
    });

    playlist.innerHTML = htmls.join('');
  },
  /**
   * 9. Scroll active song into view
   */
  scrollToActiveSong() {
      _this = this;
    setTimeout(() => {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: _this.currentIndex <3 ? 'center':'nearest'
        });
    }, 300);
  },

  /**
   * load current song into the Dashboard
   */
  loadCurrentSong() {
    //  song name
    name.innerText = this.currentSong.name;

    // song thumb
    thumb.style.backgroundImage = `url('${this.currentSong.image}')`;

    // song audio
    audio.src = this.currentSong.path;
  },

  /**
   * Subcribe all event handlers
   */
  subcribeEventHandlers() {
    const _this = this; // new binding
    // 2. Scroll top
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      // using window.scrollY or document.documentElement.scrollTop
      const scrollVertical =
        window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollVertical;
      // IMPORTANT: newCdWidth may be negatif
      // reduce image size and opacity
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : '0';
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // 3. Play/pause/seek
    togglePlay.onclick = function () {
      !_this.isPlaying && !player.classList.contains('playing')
        ? audio.play()
        : audio.pause();
    };
    // listen play/pause even to handle UI
    audio.onplay = function () {
      player.classList.add('playing');
      _this.isPlaying = true;
      // rotate thumb
      thumbAnimation.play();
    };
    audio.onpause = function () {
      player.classList.remove('playing');
      _this.isPlaying = false;
      // rotate thumb
      thumbAnimation.pause();
    };

    audio.onended = function () {
        if(!_this.isRepeat) {
            next.click();
        }
        else {
            audio.play();
        }
    }

    audio.onstop = function () {
      player.classList.remove('playing');
      _this.isPlaying = false;
      // rotate thumb
      thumbAnimation.finshed();
    };
    // when playing a song, update progress bar
    audio.ontimeupdate = function () {
      !_this.isSeeking &&
        (progress.value = Math.floor((this.currentTime * 100) / this.duration));
    };

    // seek event
    progress.onchange = function () {
      const seekTime = (this.value * audio.duration) / 100;
      audio.currentTime = seekTime;
      _this.isSeeking = false;
    };
    // to prevent reverse binding
    progress.oninput = function () {
      _this.isSeeking = true;
    };

    // 4. CD rotate
    // subcribe an ainimation
    thumbAnimation = thumb.animate([{ transform: 'rotate(360deg)' }], {
      duration: 10000,
      iterations: Infinity,
    });
    thumbAnimation.pause();
    console.log(thumbAnimation);
    console.log(audio);

    // 5. Next/previous
    prev.onclick = function () {
      _this.isRandom ? _this.randomSong() : _this.prevSong();

      // Refresh UI
      _this.handleNavigateAudio();
    };
    next.onclick = function () {

    _this.isRandom ? _this.randomSong() : _this.nextSong();

      // Refresh UI
      _this.handleNavigateAudio();
    };

    // 6. Random
    random.onclick = function () {
      _this.isRandom = !_this.isRandom;
      this.classList.toggle('active', _this.isRandom);
    };

    // 7. Next / Repeat when ended song
    repeat.onclick = function () {
        _this.isRepeat = !_this.isRepeat;
        this.classList.toggle('active', _this.isRepeat);
    }

    // 10. Play song when click in list
    // Listen on the playlist level instead of each song
    playlist.onclick = function (event) {
        // precondition- not option cliked
        if (event.target.closest('.option')) {
            return;
        }

        const clickedSong = event.target.closest('.song:not(.active)');
        // other cases => outside option icon but always in song but not active
        if (clickedSong) {
            // set as new current song
            _this.currentIndex = Number(clickedSong.getAttribute('key'));
            _this.handleNavigateAudio();
        }
    }

  },

  handleNavigateAudio() {
    // Refresh UI
    if (this.isPlaying) {
      audio.pause();
    }
    this.loadCurrentSong();
    audio.play();
    // 8. Active song
    this.render();
    this.scrollToActiveSong();
  },

  prevSong() {
    if (this.currentIndex -1  < 0) {
      this.currentIndex = this.songs.length - 1;
    }
  },

  nextSong() {
    if (this.currentIndex + 1 >= this.songs.length) {
      this.currentIndex = 0;
    }
  },

  randomSong() {
    let randomIndex;
    if (this.playedSongs.length === this.songs.length)
        this.playedSongs = [];

    do {
      randomIndex = Math.floor(Math.random() * this.songs.length);
    } while (randomIndex === this.currentIndex || this.playedSongs.includes(randomIndex));

    this.currentIndex = randomIndex;
    this.playedSongs.push(randomIndex);
    this.playedSongs = this.playedSongs // to auto save
  },
};

// starting app

app.start();
