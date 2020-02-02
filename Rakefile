require 'bundler'
Bundler.require

require 'fileutils'

REMOTE_NAME     = "origin"
GH_PAGES_BRANCH = 'master'
PROJECT_ROOT    = `git rev-parse --show-toplevel`.strip
BUILD_DIR       = File.join(PROJECT_ROOT, "build")
GH_PAGES_REF    = File.join(BUILD_DIR, ".git/refs/remotes/#{REMOTE_NAME}/#{GH_PAGES_BRANCH}")

directory BUILD_DIR

file GH_PAGES_REF => BUILD_DIR do
  repo_url = nil

  cd PROJECT_ROOT do
    repo_url = `git config --get remote.#{REMOTE_NAME}.url`.strip
  end

  cd BUILD_DIR do
    sh "git init"
    sh "git remote add #{REMOTE_NAME} #{repo_url}"
    sh "git fetch #{REMOTE_NAME}"

    if `git branch -r` =~ /#{GH_PAGES_BRANCH}/
      sh "git checkout -f #{GH_PAGES_BRANCH}"
    else
      sh "git checkout --orphan #{GH_PAGES_BRANCH}"
      sh "touch index.html"
      sh "git add ."
      sh "git commit -m 'initial #{GH_PAGES_BRANCH} commit'"
      sh "git push #{REMOTE_NAME} #{GH_PAGES_BRANCH}"
    end
  end
end

# Alias to something meaningful
task :prepare_git_remote_in_build_dir => GH_PAGES_REF

# Fetch upstream changes on gh-pages branch
task :sync do
  cd BUILD_DIR do
    sh "git fetch #{REMOTE_NAME}"
    sh "git reset --hard #{REMOTE_NAME}/#{GH_PAGES_BRANCH}"
  end
end

# Prevent accidental publishing before committing changes
task :not_dirty do
  puts "***#{ENV['ALLOW_DIRTY']}***"
  unless ENV['ALLOW_DIRTY']
    fail "Directory not clean" if /nothing to commit/ !~ `git status`
  end
end

desc "Compile all files into the build directory"
task :build do
  cd PROJECT_ROOT do
    sh "bin/build"
  end
end

desc "Refresh the libraries page contents from awesome-opal"
task :libraries do
  puts 'Downloading from fazibear/awesome-opal...'
  require 'open-uri'
  awesome_page = open 'https://raw.githubusercontent.com/fazibear/awesome-opal/master/README.md'
  awesome_contents = awesome_page.read

  File.write "#{__dir__}/source/libraries.html.md", <<~MD
  ---
  title: "Libraries (Awesome Opal)"
  ---

  _the following content comes from the *awesome* [🕶awesome-opal](https://github.com/fazibear/awesome-opal#readme) page by [Michał Kalbarczyk](https://github.com/fazibear)_

  ---

  #{awesome_contents}

  MD

  puts "Done, downloaded #{awesome_contents.bytesize} bytes."
end

desc "Build and publish to Github Pages"
task :publish => [:not_dirty, :prepare_git_remote_in_build_dir, :sync, :build] do
  message = nil
  suffix = ENV["COMMIT_MESSAGE_SUFFIX"]

  cd PROJECT_ROOT do
    head = `git log --pretty="%h" -n1`.strip
    message = ["Site updated to #{head}", suffix].compact.join("\n\n")
  end

  cd BUILD_DIR do
    sh 'git add --all'
    if /nothing to commit/ =~ `git status`
      puts "No changes to commit."
    else
      sh "git commit -m \"#{message}\""
    end
    sh "git push #{REMOTE_NAME} #{GH_PAGES_BRANCH}"
  end
end

task default: :build
