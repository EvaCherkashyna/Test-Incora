var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var User = /** @class */ (function () {
    function User(subscriptions) {
        if (subscriptions === void 0) { subscriptions = []; }
        this.subscriptions = [];
        this.subscriptions = subscriptions;
    }
    User.prototype.subscribe = function (streamingService) {
        var subscriptionСheck = this.subscriptions.some(function (subscription) {
            return subscription.streamingService.name == streamingService.name;
        });
        if (!subscriptionСheck) {
            this.subscriptions.push(new Subscription(streamingService));
            console.log("You have successfully subscribed to ".concat(streamingService.name));
        }
        else {
            console.log("You are already subscribed to ".concat(streamingService.name));
        }
        // console.log(this.subscriptions); //перевірка subscriptions
    };
    return User;
}());
//---------------------------------------------------------Subscription---------------------------------------------------------
var Subscription = /** @class */ (function () {
    function Subscription(streamingService) {
        this.streamingService = streamingService;
    }
    Subscription.prototype.watch = function (showName) {
        if (this.streamingService.viewsByShowName.has(showName)) {
            this.streamingService.setAddViewsByShowName(showName);
        }
        else {
            console.log("".concat(showName, " are not contained in the ").concat(this.streamingService.name, " service"));
        }
    };
    Subscription.prototype.getRecommendationTrending = function () {
        var currentYear = new Date().getFullYear().toString();
        var mostViewedShowsOfYear = this.streamingService.getMostViewedShowsOfYear(currentYear);
        var rand = Math.floor(Math.random() * mostViewedShowsOfYear.length);
        return mostViewedShowsOfYear[rand];
    };
    Subscription.prototype.getRecommendationByGenre = function (genre) {
        if (genre === undefined) {
            return this.streamingService.shows[Math.floor(Math.random() * this.streamingService.shows.length)];
        }
        else {
            var mostViewedShowsOfGenre = this.streamingService.getMostViewedShowsOfGenre(genre);
            var rand = Math.floor(Math.random() * mostViewedShowsOfGenre.length);
            return mostViewedShowsOfGenre[rand];
        }
    };
    return Subscription;
}());
//---------------------------------------------------------StreamingService---------------------------------------------------------
var StreamingService = /** @class */ (function () {
    function StreamingService(name, shows) {
        var _this = this;
        this.name = name;
        this.shows = shows;
        this.viewsByShowName = new Map();
        shows.forEach(function (show) {
            if (show instanceof Series) {
                _this.viewsByShowName.set(show.name, 0);
                show.episodes.forEach(function (episode) {
                    _this.viewsByShowName.set(episode.name, 0);
                });
            }
            else {
                _this.viewsByShowName.set(show.name, 0);
            }
        });
    }
    StreamingService.prototype.setAddViewsByShowName = function (name) {
        this.viewsByShowName.has(name)
            ? this.viewsByShowName.set(name, this.viewsByShowName.get(name) + 1)
            : console.log("Show \"".concat(name, "\" not found"));
        console.log(this.viewsByShowName); /* перевірка watch() */
    };
    StreamingService.prototype.addShow = function (show) {
        var _this = this;
        if (!this.viewsByShowName.has(show.name)) {
            if (show instanceof Series) {
                if (!show.episodes
                    .map(function (episode) { return episode.name; })
                    .some(function (name) { return _this.viewsByShowName.has(name); })) {
                    this.shows.push(show);
                }
                else {
                    console.log("episode in this series already exsist");
                }
            }
            else if (show instanceof Episode) {
                console.log("You can't add an episode of a series without specifying the series");
            }
            else {
                this.shows.push(show);
            }
        }
        else {
            console.log("".concat(show.name, " already exsist"));
        }
        console.log(this.shows, 'dklgdfs'); /* перевірка addShow() */
    };
    StreamingService.prototype.getMostViewedShowsOfYear = function (year) {
        var _this = this;
        var mostViewedShowsOfYear = this.shows.filter(function (show) { return show.releaseDate == year; });
        if (!mostViewedShowsOfYear.length) {
            console.log("There are no films released in ".concat(year, " on this service"));
            return [];
        }
        else {
            return mostViewedShowsOfYear
                .sort(function (a, b) {
                return _this.viewsByShowName[b.name] - _this.viewsByShowName[a.name];
            })
                .splice(0, 10);
        }
    };
    StreamingService.prototype.getMostViewedShowsOfGenre = function (genre) {
        var _this = this;
        var showsOfYear = this.shows.filter(function (show) { return show.genre.includes(genre); });
        if (!showsOfYear.length) {
            console.log("There are no ".concat(genre, " movies on this service"));
            return [];
        }
        else {
            return showsOfYear
                .sort(function (a, b) {
                return _this.viewsByShowName[b.name] - _this.viewsByShowName[a.name];
            })
                .splice(0, 10);
        }
    };
    return StreamingService;
}());
//---------------------------------------------------------Show---------------------------------------------------------
var Show = /** @class */ (function () {
    function Show(name, genre, releaseDate, duration) {
        this.name = name;
        this.genre = genre;
        this.releaseDate = releaseDate;
        this.duration = duration;
    }
    return Show;
}());
var Movie = /** @class */ (function (_super) {
    __extends(Movie, _super);
    function Movie() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Movie.prototype.getDuration = function () {
        return "".concat(this.name, ": ").concat(this.duration, " minutes");
    };
    return Movie;
}(Show));
var Series = /** @class */ (function (_super) {
    __extends(Series, _super);
    function Series(name, genre, releaseDate, duration, episodes) {
        var _this = _super.call(this, name, genre, releaseDate, duration) || this;
        _this.episodes = episodes;
        return _this;
    }
    Series.prototype.getDuration = function () {
        return "".concat(this.name, ": ").concat(Number(this.duration) * this.episodes.length, " minutes");
    };
    return Series;
}(Show));
var Episode = /** @class */ (function (_super) {
    __extends(Episode, _super);
    function Episode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Episode.prototype.getDuration = function () {
        return "".concat(this.name, ": ").concat(this.duration, " minutes");
    };
    return Episode;
}(Show));
//---------------------------------------------------------проверка работы кода---------------------------------------------------------
var netflixShows = [
    new Movie("Harry Potter 1", ["fantasy", "adventure", "foreign"], "2001", "145"),
    new Movie("Harry Potter 2", ["fantasy", "adventure", "detective", "family", "foreign"], "2002", "345"),
    new Movie("Harry Potter 3", ["action", "adventure", "detective", "fantasy", "foreign"], "2004", "143"),
    new Series("Chosen", ["historical drama"], "2017", "145", [
        new Episode("I Have Called You By Name", ["historical drama"], "2017", "173"),
        new Episode("Shabbat", ["historical drama"], "2017", "200"),
        new Episode("Jesus Loves The Little Children", ["historical drama"], "2017", "225"),
        new Episode("The Rock On Which It Is Built", ["historical drama"], "2017", "100"),
        new Episode("The Wedding Gift", ["historical drama"], "2017", "375"),
        new Episode("Indescribable Compassion", ["historical drama"], "2017", "200"),
    ]),
    new Movie("Vendetta", ["sports", "drama", "foreign"], "2021", "345"),
    new Series("Sherlock Holmes", ["detectives", "trilleries", "abroad"], "2009", "280", [
        new Episode("The Six Thatchers", ["detectives", "trilleries", "abroad"], "2009", "245"),
        new Episode("The Lying Detective", ["detectives", "trilleries", "abroad"], "2009", "111"),
        new Episode("The Abominable Bride", ["detectives", "trilleries", "abroad"], "2009", "143"),
        new Episode("His Last Vow", ["detectives", "trilleries", "abroad"], "2009", "145"),
        new Episode("The Sign of Three", ["detectives", "trilleries", "abroad"], "2009", "145"),
        new Episode("The Empty Hearse", ["detectives", "trilleries", "abroad"], "2009", "143"),
        new Episode("The Reichenbach Fall", ["detectives", "trilleries", "abroad"], "2009", "345"),
    ]),
    new Movie("30 Coins", ["mystery", "thriller", "horror", "foreign"], "2020", "345"),
    new Movie("Memory", ["action", "thriller", "foreign"], "2017", "200"),
    new Movie("Free Guy", ["comedy", "action", "adventure", "foreign"], "2022", "200"),
];
var amazonPrimeShows = [
    new Movie("Revival", ["drama", "abroad"], "2017", "145"),
    new Movie("Elvis", ["drama", "biography", "foreign", "thriller"], "2022", "145"),
    new Series("Endless Night", ["foreign", "fantasy", "thriller"], "2022", "145", [
        new Episode("The Body in the Library", ["foreign", "fantasy", "thriller"], "2022", "143"),
        new Episode("The Murder at the Vicarage", ["foreign", "fantasy", "thriller"], "2022", "143"),
        new Episode("4.50 from Paddington", ["foreign", "fantasy", "thriller"], "2022", "145"),
        new Episode("A Murder Is Announced", ["foreign", "fantasy", "thriller"], "2022", "345"),
        new Episode("4.50 from Paddington", ["foreign", "fantasy", "thriller"], "2022", "145"),
        new Episode("Sleeping Murder", ["foreign", "fantasy", "thriller"], "2022", "345"),
    ]),
    new Movie("The Staircase", ["mystery", "thriller", "crime", "drama", "biography", "foreign"], "2022", "143"),
    new Movie("Parot", ["mystery", "thriller", "crime", "foreign"], "2021", "125"),
    new Movie("30 Coins", ["mystery", "thriller", "horror", "foreign"], "2020", "200"),
    new Movie("Memory", ["action", "thriller", "foreign"], "2022", "345"),
    new Movie("Free Guy", ["comedy", "action", "adventure", "thriller", "foreign"], "2022", "200"),
    new Movie("Doctor Strange in the Multiverse of Madness", ["action", "thriller", "horror", "adventure", "foreign", "fantasy"], "2022", "145"),
    new Movie("Doctor Strange", ["action", "horror", "thriller", "adventure", "foreign", "fantasy"], "2016", "143"),
    new Movie("Infinite", ["action", "foreign"], "2022", "145"),
    new Movie("Love and Bloggers", ["comedy"], "2022", "345"),
    new Movie("Eraser: Reborn", ["action", "foreign"], "2022", "145"),
    new Movie("And There Will Be People", ["documentary"], "2022", "280"),
    new Movie("Super Pumped: The Battle for Uber", ["drama", "foreign"], "2022", "365"),
    new Movie("Memory", ["action", "thriller", "foreign"], "2022", "200"),
    new Movie("Heatwave", ["thriller", "foreign"], "2022", "145"),
    new Movie("Peacemaker", ["adventure", "foreign", "comedy", "crime", "fantasy", "action"], "2022", "200"),
];
var megogoShows = [
    new Movie("Eraser: Reborn", ["action", "foreign", "thriller"], "2022", "143"),
    new Movie("One Shot", ["action", "thriller", "foreign"], "2021", "345"),
    new Movie("Alpha Code", ["mystery", "thriller", "science fiction", "foreign"], "2020", "120"),
    new Movie("Game of Thrones", ["drama", "foreign", "fantasy", "thriller"], "2011", "143"),
    new Series("The New Pope", ["drama", "foreign"], "2019", "2:00", [
        new Episode("First Episode", ["drama", "foreign"], "2019", "145"),
        new Episode("Second Episode", ["drama", "foreign"], "2019", "245"),
        new Episode("Third Episode", ["drama", "foreign"], "2019", "245"),
        new Episode("Fourth Episode", ["drama", "foreign"], "2019", "200"),
        new Episode("Fifth Episode", ["drama", "foreign"], "2019", "143"),
        new Episode("Sixth Episode", ["drama", "foreign"], "2019", "345"),
    ]),
    new Movie("Vidas robadas", ["mystery", "melodrama", "thriller", "crime", "drama", "foreign"], "2008", "145"),
    new Movie("Kingsman: The Secret Service", ["comedy", "action", "foreign", "comics"], "2015", "345"),
    new Movie("Kingsman: The Golden Circle", ["comedy", "action", "foreign", "comics", "adventure"], "2017", "200"),
    new Movie("The King's Man", ["comedy", "action", "foreign", "adventure"], "2022", "143"),
    new Movie("Daddies", ["comedy", "entertainment", "thriller"], "2018", "200"),
    new Movie("Nobody", ["foreign", "action", "crime", "thriller"], "2021", "345"),
    new Movie("Zoya", ["drama"], "2019", "143"),
    new Movie("The Volunteer Fighter", ["action", "thriller"], "2020", "345"),
    new Movie("Fast & Furious 9", ["action", "foreign", "adventure", "crime", "thriller"], "2021", "143"),
    new Movie("Death on the Nile", ["mystery", "crime", "thriller", "drama", "foreign"], "2022", "200"),
];
var amazonPrime = new StreamingService("Amazon Prime", amazonPrimeShows);
// let netflix = new StreamingService('Netflix', netflixShows)
// let megogo = new StreamingService('Megogo', megogoShows)
var yeva = new User();
//✅👍перевірка подписок()  для перевірки відкоментувати 19 , 494 , 495 рядок
yeva.subscribe(amazonPrime);
// yeva.subscribe(netflix)
// yeva.subscribe(megogo)
// yeva.subscribe(megogo)//Повторна підписка
//✅👍 перевірка watch() для перевірки відкоментувати 68 рядок
// yeva.subscriptions.forEach((key) => {
//   if (key.streamingService == amazonPrime) {
//     key.watch("Free Guy"); // фільм що є в amazonPrime (повинен спрацювати)
//     key.watch("Death on the Nile"); // фільм якого немає в amazonPrime (не повинен працювати)
//     key.watch("A Murder Is Announced"); // епізод серіалу, який міститься в серіалі, який є в amazon Prime (повинен спрацювати)
//     key.watch("Fifth Episode"); // епізод серіалу, якого немає в серіалах amazon Prime (не повинен працювати)
//   }
// });
// ✅👍перевірка getRecommendationByGenre()
// yeva.subscriptions.forEach(key => {
//   if (key.streamingService == amazonPrime) {
//     console.log(key.getRecommendationByGenre('thriller'),'getRecommendationByGenre')
//   }
// })
// ✅👍перевірка getRecommendationTrending()
// yeva.subscriptions.forEach(key => {
//   if (key.streamingService == amazonPrime) {
//     console.log(key.getRecommendationTrending(),'getRecommendationTrending')
//   }
// })
// ✅👍 перевірка addShow() для перевірки відкоментувати 67 рядок
yeva.subscriptions.forEach(function (key) {
    if (key.streamingService == amazonPrime) {
        key.streamingService.addShow(new Movie('Death on the Nile', ['mystery', 'crime', 'thriller', 'drama', 'foreign'], '2022', "200")); //додати фільм, якого немає в amazonPrime (треба додати)
        key.streamingService.addShow(new Movie('Elvis', ['drama', 'biography', 'foreign', 'thriller'], '2022', "145")); // додати фільм, що є в amazonPrime(не потрібно додавати)
        key.streamingService.addShow(new Series('The New Pope', ['drama', 'foreign'], '2019', "2:00", [
            new Episode('First Episode', ['drama', 'foreign'], '2019', "145"),
            new Episode('Second Episode', ['drama', 'foreign'], '2019', "245"),
            new Episode('Third Episode', ['drama', 'foreign'], '2019', "245"),
            new Episode('Fourth Episode', ['drama', 'foreign'], '2019', "200"),
            new Episode('Fifth Episode', ['drama', 'foreign'], '2019', "143"),
            new Episode('Sixth Episode', ['drama', 'foreign'], '2019', "345"),
            new Episode('Sleeping Murder', ['foreign', 'fantasy', 'thriller'], '2022', "345")
        ])); //  додати серіал, в якому є епізод іншого серіалу, що є в amazonPrime (не потрібно додавати)
        // key.streamingService.addShow(new Episode('His Last Vow', ['detectives', 'trilleries', 'abroad'], '2009', "145"))// додати епізод в amazon Prime (не повинен додавати)
    }
});
// //✅👍 перевірка getDuration()
// yeva.subscriptions.forEach(key => {
//   if (key.streamingService == amazonPrime) {
//     key.streamingService.shows.forEach((show) => console.log(show.getDuration()))
//   }
// })
//✅👍 перевірка getMostViewedShowsOfYear
// yeva.subscriptions.forEach(key => {
//   if (key.streamingService == amazonPrime) {
//     console.log(key.streamingService.getMostViewedShowsOfYear("2012"))//нету фільмів з таким роком випуску (не повинен знайти)
//     console.log(key.streamingService.getMostViewedShowsOfYear("2022"))//є фільми з таким роком випуску (повинен знайти)
//   }
// })
//✅👍перевірка getMostViewedShowsOfGenre
// yeva.subscriptions.forEach(key => {
//   if (key.streamingService == amazonPrime) {
//     console.log(key.streamingService.getMostViewedShowsOfGenre("thriller"))//є фільми з таким роком випуску (повинен знайти)
//     console.log(key.streamingService.getMostViewedShowsOfGenre("historical drama"))//нету фільмів з таким роком випуску (не повинен знайти)
//   }
// })
