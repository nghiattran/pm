/* Hello World program */

#include <stdio.h>
#include <git2.h>
#include <unistd.h>
static const char *colors[] = {
  "\033[m", /* reset */
  "\033[1m", /* bold */
  "\033[31m", /* red */
  "\033[32m", /* green */
  "\033[36m" /* cyan */
};

static int color_printer(
  const git_diff_delta*, const git_diff_hunk*, const git_diff_line*, void*);
static int diff_output(
	const git_diff_delta*, const git_diff_hunk*, const git_diff_line*, void*);
int main(int argc, char *argv[]) {
    git_libgit2_init();
    git_repository *repo = NULL;
    git_diff *diff = NULL;

    const char *repo_path = "/home/nghia/.git_packages/cache/version-checker/.git";
    fprintf(stdout, "Current working dir: %s\n", repo_path);
    int error = git_repository_open(&repo, repo_path);
    fprintf(stdout, "error: %d\n", error);
    error = git_diff_index_to_workdir(&diff, repo, NULL, NULL);
    fprintf(stdout, "error: %d\n", error);
    git_diff_print(diff, GIT_DIFF_FORMAT_PATCH, color_printer, NULL);
    git_diff_free(diff);
    git_libgit2_shutdown();
    return 0;



//    error = git_diff_index_to_workdir(&diff, repo, NULL, NULL);
//	struct opts o = {
//		GIT_DIFF_OPTIONS_INIT, GIT_DIFF_FIND_OPTIONS_INIT,
//		-1, 0, 0, GIT_DIFF_FORMAT_PATCH, NULL, NULL, "."
//	};

//	git_libgit2_init();
}

int diff_output(
	const git_diff_delta *d,
	const git_diff_hunk *h,
	const git_diff_line *l,
	void *p)
{
	FILE *fp = (FILE*)p;

	(void)d; (void)h;

	if (!fp)
		fp = stdout;

	if (l->origin == GIT_DIFF_LINE_CONTEXT ||
		l->origin == GIT_DIFF_LINE_ADDITION ||
		l->origin == GIT_DIFF_LINE_DELETION)
		fputc(l->origin, fp);

	fwrite(l->content, 1, l->content_len, fp);

	return 0;
}

static int color_printer(
  const git_diff_delta *delta,
  const git_diff_hunk *hunk,
  const git_diff_line *line,
  void *data)
{
  int *last_color = data, color = 0;

  (void)delta; (void)hunk;

  if (*last_color >= 0) {
    switch (line->origin) {
    case GIT_DIFF_LINE_ADDITION:  color = 3; break;
    case GIT_DIFF_LINE_DELETION:  color = 2; break;
    case GIT_DIFF_LINE_ADD_EOFNL: color = 3; break;
    case GIT_DIFF_LINE_DEL_EOFNL: color = 2; break;
    case GIT_DIFF_LINE_FILE_HDR:  color = 1; break;
    case GIT_DIFF_LINE_HUNK_HDR:  color = 4; break;
    default: break;
    }

    if (color != *last_color) {
      if (*last_color == 1 || color == 1)
        fputs(colors[0], stdout);
      fputs(colors[color], stdout);
      *last_color = color;
    }
  }

  return diff_output(delta, hunk, line, stdout);
}