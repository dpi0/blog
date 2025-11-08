+++
title = "Markdown Syntax Guide"
date = "2020-01-03"
description = "Sample article showcasing basic Markdown syntax and formatting for HTML elements."
tags = [
    "markdown",
    "syntax",
]
+++

For a quick cheatsheet, check out https://simplemde.com/markdown-guide.

---

This article offers a sample of basic Markdown syntax that can be used in Hugo content files, also it shows whether basic HTML elements are decorated with CSS in a Hugo theme.
<!--more-->

## Headings

The following HTML `<h1>`—`<h6>` elements represent six levels of section headings. `<h1>` is the highest section level while `<h6>` is the lowest.

## H2
### H3
#### H4
##### H5
###### H6

## Paragraph

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Blockquotes

The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a `footer` or `cite` element, and optionally with in-line changes such as annotations and abbreviations.

#### Blockquote without attribution

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.
> **Note** that you can use *Markdown syntax* within a blockquote.

#### Blockquote with attribution

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.

## Tables

Tables aren't part of the core Markdown spec, but Hugo supports supports them out-of-the-box.

   Name | Age
--------|------
    Bob | 27
  Alice | 23

#### Inline Markdown within tables

| Italics   | Bold     | Code   |
| --------  | -------- | ------ |
| *italics* | **bold** | `code` |

## Code Blocks

#### Code block with backticks

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example HTML5 Document</title>
</head>
<body>
  <p>Test</p>
</body>
</html>
```

#### Code block indented with four spaces

    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Example HTML5 Document</title>
    </head>
    <body>
      <p>Test</p>
    </body>
    </html>

#### Code block with Hugo's internal highlight shortcode
{{< highlight html >}}
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example HTML5 Document</title>
</head>
<body>
  <p>Test</p>
</body>
</html>
{{< /highlight >}}

```bash {class="my-class" id="my-codeblock" lineNos=inline tabWidth=2}
declare a=1
echo "$a"
exit
```

```bash {class="my-class" id="my-codeblock" lineNos=inline tabWidth=2}
#!/usr/bin/env bash

host=$(grep -E '^Host ' ~/.ssh/config | awk '{print $2}' | grep -v '[*?]' |
	rofi -dmenu -p "SSH" -kb-custom-1 "Alt+Return" -mesg "Alt+Enter: New kitty window")
ret=$?

if [ -n "$host" ]; then
	case $ret in
	0) # Enter → tmux new-window
		tmux new-window "ssh $host"
		;;
	10) # Alt+Enter → new kitty window
		kitty ssh "$host" &
		;;
	esac
fi
```

```go {title="main.go"}
package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

const (
	baseURL = "http://www.omdbapi.com/"
)

var (
	apiKey = os.Getenv("API_KEY")
	tmpl   = template.Must(template.ParseFiles("templates/index.html"))
)

type Movie struct {
	ID     int
	Hash   string
	Title  string
	Dt     string
	Cat    string
	Size   int64
	ExtID  sql.NullString
	IMDB   sql.NullString
}

type SearchResult struct {
	Search       []struct{ ImdbID string `json:"imdbID"` } `json:"Search"`
	TotalResults string                                     `json:"totalResults"`
	Response     string                                     `json:"Response"`
}

func (m *Movie) SizeReadable() string {
	if m.Size >= 1<<30 {
		return fmt.Sprintf("%.2f GB", float64(m.Size)/(1<<30))
	}
	return fmt.Sprintf("%.2f MB", float64(m.Size)/(1<<20))
}

func (m *Movie) FormattedDate() string {
	t, err := time.Parse("2006-01-02 15:04:05", m.Dt)
	if err != nil {
		return m.Dt
	}
	return t.Format("02 Jan 2006 - 15:04:05")
}

func getIMDbID(movieName string) (string, error) {
	url := fmt.Sprintf("%s?apikey=%s&s=%s", baseURL, apiKey, url.QueryEscape(movieName))
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var result SearchResult
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}

	if len(result.Search) == 0 {
		return "", fmt.Errorf("no results found for '%s'", movieName)
	}

	return result.Search[0].ImdbID, nil
}
```

```py
import subprocess
import time

import typer
from rich.progress import track
from typing_extensions import Annotated

app = typer.Typer(no_args_is_help=True)


@app.command()
def create(
    name: Annotated[str, typer.Option(help="Name of the Debian Virtual Machine")],
    ram: Annotated[
        int, typer.Option(help="Amount of RAM in Megabytes, like 1024 or 2048")
    ],
    vcpu: Annotated[int, typer.Option(help="Number of virtual CPU cores, like 1 or 2")],
    port: Annotated[
        int, typer.Option(help="Host port to connect with. Maps PORT to :22 internally")
    ],
):
    user_data_path = f"/home/dpi0/projects/kubernetes/the-hard-way/kvm-provisioning/{name}/user-data.yml"
    cidata_iso_path = f"/var/lib/libvirt/images/{name}-cidata.iso"
    qcow2_path = f"/var/lib/libvirt/images/{name}.qcow2"
    template_path = (
        "/var/lib/libvirt/images/templates/debian-12-genericcloud-amd64.qcow2"
    )
    qemu_log = f"/var/log/qemu-{name}.log"

    commands = [
        ["sudo", "cloud-localds", cidata_iso_path, user_data_path],
        [
            "sudo",
            "qemu-img",
            "create",
            "-f",
            "qcow2",
            "-F",
            "qcow2",
            "-b",
            template_path,
            qcow2_path,
            "10G",
        ],
        [
            "sudo",
            "qemu-system-x86_64",
            "-enable-kvm",
            "-m",
            str(ram),
            "-smp",
            str(vcpu),
            "-drive",
            f"file={qcow2_path},format=qcow2",
            "-drive",
            f"file={cidata_iso_path},format=raw",
            "-netdev",
            f"user,id=net0,hostfwd=tcp::{port}-:22",
            "-device",
            "virtio-net-pci,netdev=net0",
            "-display",
            "none",
            "-daemonize",
            "-serial",
            f"file:{qemu_log}",
        ],
    ]

    for cmd in commands:
        typer.echo(f"Running: {' '.join(cmd)}")
        subprocess.run(cmd, check=True)

    typer.echo("Waiting for VM to boot...")
    for _ in track(range(30), description="🟢 Booting VM..."):
        time.sleep(1)


@app.callback()
def callback():
    """Debian VM provisioner with QEMU/KVM and cloud-init"""
    pass


if __name__ == "__main__":
    app()
```

```php
$var = ["bob", "sam"];
foreach ($var as $name) {
    echo $var;
}
```

```go {title="main.go"}
package main

import "fmt"

func main() {
    fmt.Println("Hello, Hugo!")
}
```

```html {title="index.html"}
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example HTML5 Document</title>
</head>
<body>
  <p>Test</p>
</body>
</html>
```


## List Types


#### Ordered List

1. First item
2. Second item
3. Third item

#### Unordered List

* List item
* Another item
* And another item

#### Nested list

* Fruit
  * Apple
  * Orange
  * Banana
* Dairy
  * Milk
  * Cheese

## Other Elements — abbr, sub, sup, kbd, mark

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.
