import tkinter as tk
import random

#список слов из 5 букв
wordlist = []
file = open('wordlist.txt', encoding='utf-8')
for line in file:
    wordlist.append(line[:-1].upper())

bg_color = '#fffae8' #цвет фона

window = tk.Tk()
window.title('Wordle')
window.geometry('800x800+400+0')
window['background'] = bg_color


#клавиатура
keyboard = tk.Frame(background=bg_color, pady=20) #общий контейнер для клавиш
keyboard.pack(side='bottom')
keyboard1 = tk.Frame(keyboard, background=bg_color)  #контейнер для первого ряда
keyboard1.pack(side='top', pady=2)
keyboard2 = tk.Frame(keyboard, background=bg_color)
keyboard2.pack(side='top', pady=2)
keyboard3 = tk.Frame(keyboard, background=bg_color)
keyboard3.pack(side='top', pady=2)
line1 = ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ']
line2 = ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э']
line3 = ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю']
btn_line1 = []
btn_line2 = []
btn_line3 = []
btn_font = 'Arial 12'
btn_bg = 'white'
for i in line1:
    btn = tk.Button(keyboard1, text=i, height=1, width=2, font=btn_font, background=btn_bg)
    btn.pack(side='left', padx=3, pady=1)
    btn_line1.append(btn)
for i in line2:
    btn = tk.Button(keyboard2, text=i, height=1, width=2, font=btn_font, background=btn_bg)
    btn.pack(side='left', padx=3, pady=1)
    btn_line2.append(btn)
for i in line3:
    btn = tk.Button(keyboard3, text=i, height=1, width=2, font=btn_font, background=btn_bg)
    btn.pack(side='left', padx=3, pady=1)
    btn_line3.append(btn)

# квадратики с буквами
cellsframe = tk.Frame(background = bg_color)  #общий контейнер
cellsframe.pack(pady=2)

cells = [[], [], [], [], [], []]

for i in range(6):
    for j in range(5):
        cells[i].append(tk.Label(cellsframe, width=8, height=6, borderwidth=1, relief='solid'))
        cells[i][j].grid(row=i, column=j, padx=2, pady=2)

i = 0
j = 0
word = []
ans = random.choice(wordlist) #ответ
#print(ans)

def on_wasd(event):
    #print(event.keysym, event.char, event.keycode)
    global i
    global j
    global word
    global ans
    code = event.keycode
    #print(code)
    if j < 5:
        if (code >= 65 and code <= 90) or code == 219 or code == 221 or code == 186 or code == 222 or code == 188 or code == 190:
            cells[i][j]['text'] = event.char.upper()
            #cells[i][j]['font'] = ('Arial')
            word.append(event.char.upper())
            # print(i, j)
            j += 1
    else:
        if code==13: #нажатие enter
            print('проверка слова')
            if ''.join(word) in wordlist:
                j = 0
                i += 1
                ans_vacant = [True, True, True, True, True] #занятость букв в ответе
                num_of_right = 0  # счетчик зеленых
                guessed = [False, False, False, False, False] #угаданные и желтые и зеленые
                #цикл для зеленых
                for k in range(5):
                    if ans[k] == word[k]:
                        #print(k, word[k])
                        ans_vacant[k] = False
                        num_of_right += 1
                        cells[i-1][k]['background'] = 'green'
                        cells[i-1][k]['foreground'] = 'white'
                        for btn in btn_line1:
                            if btn['text'].upper() == word[k]:
                                btn['background'] = 'green'
                        for btn in btn_line2:
                            if btn['text'].upper() == word[k]:
                                btn['background'] = 'green'
                        for btn in btn_line3:
                            if btn['text'].upper() == word[k]:
                                btn['background'] = 'green'
                        guessed[k] = True
                #print(ans_vacant)
                #цикл для желтых
                for index_word in range(5):
                    for index_ans in range(5):
                        if (word[index_word] == ans[index_ans]) and (ans_vacant[index_ans]) and (not guessed[index_word]):
                            #print(index_word, index_ans)
                            #print(index_word, word[index_word], ans_vacant[index_ans])
                            ans_vacant[index_ans] = False
                            cells[i-1][index_word]['background'] = 'yellow'
                            for btn in btn_line1:
                                if (btn['text'].upper() == word[index_word]) and (btn['background'] == 'white'):
                                    btn['background'] = 'yellow'
                            for btn in btn_line2:
                                if (btn['text'].upper() == word[index_word]) and (btn['background'] == 'white'):
                                    btn['background'] = 'yellow'
                            for btn in btn_line3:
                                if (btn['text'].upper() == word[index_word]) and (btn['background'] == 'white'):
                                    btn['background'] = 'yellow'
                            guessed[index_word] = True
                #цикл для серых
                for k in range(5):
                    if not guessed[k]:
                        cells[i-1][k]['background'] = 'grey'
                        cells[i - 1][k]['foreground'] = 'white'
                        for btn in btn_line1:
                            if (btn['text'].upper() == word[k]) and (btn['background'] == 'white'):
                                btn['background'] = 'grey'
                        for btn in btn_line2:
                            if (btn['text'].upper() == word[k]) and (btn['background']=='white'):
                                btn['background'] = 'grey'
                        for btn in btn_line3:
                            if (btn['text'].upper() == word[k]) and (btn['background']=='white'):
                                btn['background'] = 'grey'

                if num_of_right == 5:
                    print('ПОБЕДА')
                    win = tk.Label(text='ПОБЕДА!', font=('Arial', 25), background=bg_color)
                    win.pack()
                    window.unbind_all("<Key>")
                else:
                    if (i == 6):
                        fail = tk.Label(text='ПРОИГРЫШ', font=('Arial', 20), background=bg_color)
                        fail.pack()
                        ans_was = tk.Label(text='Ответ был: '+ans, font=('Arial', 16), background=bg_color)
                        ans_was.pack()
                        print('ПРОИГРЫШ')
                        window.unbind_all("<Key>")

                word = []
                #print('ok', i, j)
            else:
                print('игра не знает такого слова')
                pass
    if (code==8 and j>=1): #нажатие backspace
        j -= 1
        word.pop(-1)
        cells[i][j]['text'] = ''
    # if (j<4) and (code==13) #уведомление введите слово до конца
    # j += 1

print('нажимайте на кнопки с клавиатуры ПК\nкнопки на экране пока не работают')
window.bind_all("<Key>", on_wasd)

#пример дизайна кнопки
#button = tk.Button(window,padx = 5,pady = 5,text = 'Link',bd = 0, fg = '#fff', bg = '#08f',underline = 0 , activebackground = '#fff', activeforeground = '#fff',cursor = 'hand2') # Инициализация кнопки
#button.pack(expand = 1)

window.mainloop()