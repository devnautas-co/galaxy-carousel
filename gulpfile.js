const gulp = require("gulp");
const Fiber = require("fibers");
const pug = require("gulp-pug");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();

const compilePug = () => {
    return gulp.src("./*.pug")
        .pipe(pug())
        .pipe(gulp.dest("./docs/"))
        .pipe(browserSync.stream());
}

const compileSass = () => {
    return gulp.src("./sass/*.{scss,sass}")
        .pipe(sass({outputStyle: "compressed", fiber: Fiber}).on("error", sass.logError))
        .pipe(gulp.dest("./docs/assets/styles/"))
        .pipe(browserSync.stream());
}

const compileJs = () => {
    return gulp.src("./scripts/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./docs/assets/scripts/"))
        .pipe(browserSync.stream());
}

const moveAssets = () => {
    return gulp.src("./assets/**/*")
        .pipe(gulp.dest("./docs/assets/"));
}

const serverReload = cb => {
    browserSync.reload();
    cb();
}

const watchTask = () => {
    gulp.watch("./**/*.pug", gulp.series(compilePug, serverReload));
    gulp.watch("./sass/*.sass", gulp.series(compileSass, serverReload));
    gulp.watch("./scripts/*.js", gulp.series(compileJs, serverReload));
    gulp.watch("./docs/**/*", serverReload);
}

const liveServer = cb => {
    browserSync.init({
        server: {
            baseDir: "./docs/"
        }
    });

    cb();
}

exports.default = gulp.series(
    compilePug,
    compileSass,
    liveServer,
    moveAssets,
    watchTask
)