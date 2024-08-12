#include <cstdlib>
#include <curl/curl.h>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>

using namespace std;
namespace fs = filesystem;

const string colors[] = {
    "\x1b[0m",  // reset
    "\x1b[31m", // red
    "\x1b[33m", // yellow
    "\x1b[34m", // blue
    "\x1b[32m", // green
    "\x1b[36m", // cyan
    "\x1b[35m", // magenta
    "\x1b[37m", // white
    "\x1b[30m", // black
    "\x1b[39m"  // normal
};

const string styles[] = {
    "\x1b[1m", // bold
    "\x1b[4m", // underline
    "\x1b[7m", // reverse
    "\x1b[22m" // normal
};

const string pcssUrl =
    "https://raw.githubusercontent.com/Thoq-jar/PCSS/master/.pcss/pcss.min.js";
const vector<string> commands = {
    "",
    " version: Shows this screen,",
    " about: Shows this screen,",
    " info: Shows this screen,",
    " help: Shows this screen,",
    " new: Creates a new project,",
    " update: Updates the CLI,",
    " init: Initializes PCSS in your existing project,"};

const string newUsage = "Usage: pcss new { project name }";

string getNpmVersion() {
  try {
    string result = string(getenv("npm -v"));
    result += " npm";
    return result;
  } catch (const exception &e) {
    cerr << "Error fetching npm version: " << e.what() << endl;
    return "unknown";
  }
}

void nline() { cout << endl; }

void print(const string &msg) { cout << msg << endl; }

void printc(const string &style, const string &color, const string &msg) {
  cout << style << color << msg << colors[0] << endl;
}

void about() {
  vector<string> info = {"\n",
                         " PerfectCSS CLI: v1.6.2",
                         "",
                         " Help: ",
                         " Commands: " + [&]() {
                           string result;
                           for (const auto &command : commands) {
                             result += command + "\n";
                           }
                           return result;
                         }()};

  const string logo = R"(
  .______     ______     _______.     _______.     ______  __       __
  |   _  \   /      |   /       |    /       |    /      ||  |     |  |
  |  |_)  | |  ,----'  |   (----`   |   (----`   |  ,----'|  |     |  |
  |   ___/  |  |        \   \        \   \       |  |     |  |     |  |
  |  |      |  `----.----)   |   .----)   |      |  `----.|  `----.|  |
  | _|       \______|_______/    |_______/        \______||_______||__|
    )";

  printc(styles[3], colors[6], logo);
  for (const auto &line : info) {
    printc(styles[0], colors[4], line);
  }
}

size_t WriteCallback(void *contents, size_t size, size_t nmemb,
                     string *output) {
  size_t totalSize = size * nmemb;
  output->append((char *)contents, totalSize);
  return totalSize;
}

bool downloadFile(const string &url, const string &dest) {
  CURL *curl = curl_easy_init();
  if (!curl) {
    return false;
  }

  string response;
  curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
  curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
  curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

  CURLcode res = curl_easy_perform(curl);
  curl_easy_cleanup(curl);

  if (res != CURLE_OK) {
    return false;
  }

  ofstream file(dest, ios::binary);
  if (!file) {
    return false;
  }

  file.write(response.c_str(), response.size());
  file.close();

  return true;
}

const string scriptTag = "<script src=\"./.pcss/pcss.min.js\"></script>";

void createIndexHtml(const string &filePath) {
  const string htmlContent = R"(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PCSS Starter</title>
    <script src="./.pcss/pcss.min.js"></script>
</head>
<body>
    <h1>PCSS Starter template</h1>
</body>
</html>)";

  ofstream file(filePath);
  file << htmlContent;
  file.close();
}

void createProject(const string &projectName) {
  fs::path projectDir = projectName;
  fs::path pcssDir = projectDir / ".pcss";
  fs::path pcssFilePath = pcssDir / "pcss.min.js";

  if (!fs::exists(projectDir)) {
    fs::create_directory(projectDir);
  }
  if (!fs::exists(pcssDir)) {
    fs::create_directory(pcssDir);
  }

  try {
    if (downloadFile(pcssUrl, pcssFilePath.string())) {
      createIndexHtml((projectDir / "index.html").string());
      printc(styles[0], colors[4],
             "Successfully initialized " + projectName + "!");
    } else {
      throw runtime_error("Failed to download PCSS file");
    }
  } catch (const exception &error) {
    printc(styles[0], colors[1], "Error: " + string(error.what()));
  }
}

void initPCSS() {
  fs::path pcssDir = ".pcss";
  fs::path pcssFilePath = pcssDir / "pcss.min.js";

  if (!fs::exists(pcssDir)) {
    fs::create_directory(pcssDir);
  }

  try {
    if (downloadFile(pcssUrl, pcssFilePath.string())) {
      printc(styles[0], colors[4],
             "Successfully initialized PCSS in your project!");
      printc(styles[1], colors[3],
             "To start using PCSS, add the following script tag to your HTML "
             "file:");
      printc(styles[0], colors[3], scriptTag);
    } else {
      throw runtime_error("Failed to download PCSS file");
    }
  } catch (const exception &error) {
    printc(styles[0], colors[1], "Error: " + string(error.what()));
  }
}

int main(int argc, char *argv[]) {
  if (argc < 2) {
    printc(styles[0], colors[1],
           "Unknown command/usage. For help, type \"pcss help\"");
    return 1;
  }

  string command = argv[1];
  string projectName = (argc > 2) ? argv[2] : "";

  if (command == "version" || command == "about" || command == "info" ||
      command == "help") {
    about();
  } else if (command == "new" && projectName.empty()) {
    printc(styles[0], colors[1], newUsage);
    return 1;
  } else if (command == "update") {
    printc(styles[0], colors[3], "Updating...");
    system("npm install -g pc-cli@latest");
    printc(styles[0], colors[4], "Updated to the latest version!");
  } else if (command == "new" && !projectName.empty()) {
    printc(styles[1], colors[3], "Creating new project: " + projectName);
    createProject(projectName);
  } else if (command == "init") {
    printc(styles[0], colors[3],
           "Installing PerfectCSS to your current project...");
    initPCSS();
  } else {
    printc(styles[0], colors[1],
           "Unknown command/usage: " + command +
               ", for help type \"pcss help\"");
    return 1;
  }

  return 0;
}