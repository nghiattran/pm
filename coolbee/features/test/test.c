/* Hello World program */

#include <stdio.h>
#include <git2.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    git_libgit2_init();
    git_repository *repo = NULL;
    git_diff *diff = NULL;

    char cwd[1024];
    if (getcwd(cwd, sizeof(cwd)) != NULL) {
        fprintf(stdout, "Current working dir: %s\n", cwd);
        int error = git_repository_open(&repo, cwd);
        error = git_diff_index_to_workdir(&diff, repo, NULL, NULL);
        git_diff_free(diff);
    }
    else
        perror("getcwd() error");

    git_libgit2_shutdown();
    return 0;



//    error = git_diff_index_to_workdir(&diff, repo, NULL, NULL);
//	struct opts o = {
//		GIT_DIFF_OPTIONS_INIT, GIT_DIFF_FIND_OPTIONS_INIT,
//		-1, 0, 0, GIT_DIFF_FORMAT_PATCH, NULL, NULL, "."
//	};

//	git_libgit2_init();
}