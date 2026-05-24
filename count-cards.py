import re
c = open(r'C:\Users\Administrator\ai-tools-hub\index-new.html', 'r', encoding='utf-8').read()
cards = re.findall(r'data-name="([^"]+)"', c)
print(f'{len(cards)} cards')
for x in cards:
    print(' ', x)
