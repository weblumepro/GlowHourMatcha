The homepage plays /videos/hero-loop.mp4 (src set in src/App.jsx, Hero component).

hero-loop.mp4 is generated from images/homepageVideo.mp4 with a 1.5s crossfade
baked into the loop seam (last clip dissolves into the first), via:

  ffmpeg -i homepageVideo.mp4 -i homepageVideo.mp4 ^
    -filter_complex "[0:v][1:v]xfade=transition=fade:duration=1.5:offset=6.5[xf];[xf]trim=1.5:8,setpts=PTS-STARTPTS[v]" ^
    -map "[v]" -an -c:v libx264 -pix_fmt yuv420p -crf 19 -preset slow -movflags +faststart hero-loop.mp4

(offset = source duration - fade duration; trim start = fade duration.)

If you swap in a new source video, re-run the command with its duration and
use a fresh filename (and update the src in App.jsx) so browsers don't serve
a stale cached copy.
