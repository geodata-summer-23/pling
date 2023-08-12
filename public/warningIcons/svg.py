import os

svgDir = "public/warningIcons/"
files = os.listdir(svgDir)
svgs = [file for file in files if file.endswith(".svg")]
names = list(set([svg[: svg.rfind("-")] for svg in svgs]))

print(names)

for name in names:
    try:
        with open(svgDir + name + "-red.svg", "r") as fileRed:
            svg = fileRed.read()
            svg = svg.replace("black", "gray")
            svg = svg.replace("white", "gray")
            svg = svg.replace("#731415", "gray")
            svg = svg.replace("#C60000", "white")
            with open(svgDir + name + "-white.svg", "w") as fileWhite:
                fileWhite.write(svg)
    except:
        print(f"Failed: {name}")
