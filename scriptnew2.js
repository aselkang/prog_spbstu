window.addEventListener('load', main, false);
function main() {
	var ctx = canvas_example.getContext('2d');
	var w = canvas_example.width;
	var h = canvas_example.height;

	function fieldAnalysis(field, N, M) {
		//по горизонтали
		for (var i = 0; i < N; i++) {
			var currNum = 1; //кол-во элементов в текущей группе
			var currType = Math.abs(field[i][0])
			for (var j = 1; j < M; j++) {
				if (Math.abs(field[i][j]) == currType) {
					currNum += 1;
				}
				else {
					if (currNum > 2) {
						for (var k = 0; k < currNum; k++) {
							field[i][j-currNum+k] = (-1)*Math.abs(field[i][j-currNum+k]);
						}
					}
					currType = Math.abs(field[i][j]);
					currNum = 1;
				}

				//концевая группа
				if ((j == M-1) && (currNum > 2)) {
					for (var k = 0; k < currNum; k++) {
						field[i][j-(currNum-1)+k] = (-1)*Math.abs(field[i][j-(currNum-1)+k]);
					}
				}
			}
		}

		//по вертикали
		for (var j = 0; j < M; j++) {
			var currNum = 1;
			var currType = Math.abs(field[0][j]);
			for (var i = 1; i < N; i++) {
				if (Math.abs(field[i][j]) == currType) {
					currNum += 1;
				}
				else {
					if (currNum > 2) {
						for (var k = 0; k < currNum; k++) {
							field[i-currNum+k][j] = (-1)*Math.abs(field[i-currNum+k][j]);
						}
					}
					currType = Math.abs(field[i][j]);
					currNum = 1;
				}
				if ((i == N-1) && (currNum > 2)) {
					for (var k = 0; k < currNum; k++) {
						field[i-(currNum-1)+k][j] = (-1)*Math.abs(field[i-(currNum-1)+k][j]);
					}
				}
			}
		}
		return field; //не так уж нам и нужен ретерн раз объекты изменяютс при вызове функций
		//видимо тоже предаются ссылки на них а не значения
	}

	//падение элементов
	function fall(field, M, N) {
		for (var j = 0; j < M; j++) {
			var holeNum = 0; //число пропусков в текущем столбце
			var lowest;
			for (var i = N-1; i >= 0; i--) {
				if (field[i][j] < 0) {
					holeNum += 1; //+1 к счетчику пропусков
					if (holeNum == 1) { //самый нижний пропуск
						lowest = i;
					}
				}
				if ((field[i][j] > 0) && (holeNum > 0)) { //элемент над пропуском
					field[lowest][j] = field[i][j];
					lowest -= 1;
					field[i][j] = -10;
				}
			}
		}
		return field;
	}

	var N = 8, M = 8;
	var field = [];
	var numOfTypes = 6;
	for (var i = 0; i < N; i++) {
		field.push([]);
		for (var j = 0; j < M; j++) {
			field[i].push(Math.floor(Math.random()*numOfTypes)+1);
		}
	}

	fieldAnalysis(field, N, M);

	fall(field, N, M);

	//проверка на пустые места (на наличие минуоовых)
	function ifEmpty(field, N, M) {
		for (var i = 0; i < N; i++) {
			for (var j = 0; j < M; j++) {
				if (field[i][j] < 0) {
					return true;
				}
			}
		}
		return false;
	}

	while (ifEmpty(field, N, M)) {
		for (var i = 0; i < N; i++) {
			for (var j = 0; j < M; j++) {
				if (field[i][j] < 0) {
					field[i][j] = Math.floor(Math.random()*numOfTypes)+1;
					console.log('поменял');
				}
			}
		}
		fieldAnalysis(field, N, M);
	}

	//считаем что w=h всегда
	//или можно Math.min(N, M);


	var d = Math.floor(w/Math.max(N, M)) //размеры одной клетки
	
	backgroundcolor = 'white';
	borderscolor = "rgba(0, 0, 0, 1)";
	//borderscolor = 'black';

	ctx.strokeStyle = borderscolor;
	//ctx.lineWidth = 0.6;
	for (var i = 1; i < N; i++) {
		ctx.moveTo(0, i*d);
		ctx.lineTo(w, i*d);
		ctx.stroke();
	}
	for (var j = 1; j < N; j++) {
		ctx.moveTo(j*d, 0);
		ctx.lineTo(j*d, h);
		ctx.stroke();
	}

	//рисование одного элемента
	function drawOne(i, j, type) {
		ctx.beginPath();
		var color;
		if (type == 1) {
			color = 'red';
		}
		else if (type == 2) {
			color = 'blue';
		}
		else if (type == 3) {
			color = 'green';
		}
		else if (type == 4) {
			color = 'yellow';
		}
		else if (type == 5) {
			color = 'magenta';
		}
		else if (type == 6) {
			color = 'black';
		}
		ctx.fillStyle = color;
		//x, y - коор-ты центра одного элемента
		var x = d*j + d/2;
		var y = d*i + d/2;
		if (true){
			var R = d/2-5;
			//ctx.clearRect(j*d+1, i*d+1, d-1, d-1);
			ctx.beginPath();
			ctx.arc(x, y, R, 0, 2*Math.PI);
			ctx.fillStyle = this.color;
			ctx.fill();
		}
	}

	//подсчет очков
	var numOfElem = 0; //количество уничтоженных
	var points = 0; //количество очков
	textview.value = points;

	//начальная отрисовка поля
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < M; j++) {
			drawOne(i, j, field[i][j]);
		}
	}

	//графическое выделение нажатой клетки
	function select(i, j) {
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 0, 0, 0)";
		ctx.rect(j*d, i*d, d, d);
		ctx.stroke();
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fill();
	}

	//отмена выделения
	function deselect(i, j, type) {
		ctx.beginPath();
		ctx.rect(j*d, i*d, d, d);
		ctx.fillStyle = backgroundcolor;
		ctx.fill();
		ctx.strokeStyle = borderscolor;
		ctx.stroke();
		drawOne(i, j, type);
	}

	function selectRight(i, j) {
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 0, 0, 0)";
		ctx.rect(j*d, i*d, d, d);
		ctx.stroke();
		ctx.fillStyle = "rgba(104, 255, 104, 0.5)";
		ctx.fill();
	}

	//обработка нажатий
	var clicks = 0; //счетчик нажатий
	var i1, i2, j1, j2;
	canvas_example.onclick = (e) => {
		clicks += 1;

		//строка и столбец клетки на которую нажали
		var ii = ~~(e.offsetY/d);
		var jj = ~~(e.offsetX/d);

		select(ii, jj);

		if (clicks == 1) { //первая нажатая
			//в какую клектку мы попали:
			i1 = ii;
			j1 = jj;
		}
		else { //вторая нажатая
			i2 = ii;
			j2 = jj;

			//если не соседи
			if (!( ((Math.abs(i1-i2)==1)&&(j1==j2)) || ((Math.abs(j1-j2)==1)&&(i1==i2)) )) {
				deselect(i1, j1, field[i1][j1]);
				deselect(i2, j2, field[i2][j2]);
			}
			//если соседи
			else {
				numOfElem = 0;

				//меняем местами
				var t = field[i1][j1];
				field[i1][j1] = field[i2][j2];
				field[i2][j2] = t;
				var type1 = field[i1][j1];
				var type2 = field[i2][j2];

				//проверка оказались ли три в ряд после 
				fieldAnalysis(field, N, M);
				var ifRight = false; //если "правильный" ход
				for (var i = 0; i < N; i++) {
					for (var j = 0; j < M; j++) {
						if (field[i][j] < 0) {
							ifRight = true;
							numOfElem += 1;
						}
					}
				}

				if (ifRight) {
					//графически меняем местами
					drawOne(i1, j1, type1);
					drawOne(i2, j2, type2);
					deselect(i1, j1, type1);
					deselect(i2, j2, type2);

					//подсчет очков
					points += numOfElem;
					textview.value = points;


					for (var i = 0; i < N; i++) {
						for (var j = 0; j < M; j++) {
							if (field[i][j] < 0) {
								selectRight(i, j);
							}
						}
					}

					for (var i = 0; i < N; i++) {
						for (var j = 0; j < M; j++) {
							if (field[i][j] < 0) {
								disappearTime(i, j);
							}
						}
					}

					fall(field, N, M);

					while (ifEmpty(field, N, M)) {
						for (var i = 0; i < N; i++) {
							for (var j = 0; j < M; j++) {
								if (field[i][j] < 0) {
									field[i][j] = Math.floor(Math.random()*numOfTypes)+1;
								}
							}
						}				
						fieldAnalysis(field, N, M);
					}

					console.log(field);

					for (var i = 0; i < N; i++) {
						for (var j = 0; j < M; j++) {
							drawTime(i, j, field[i][j]);
						}
					}

				//если три в ряд не образовалось
				}
				else {
					//ничего не происходит
					//меняем местами обратно
					t = field[i1][j1];
					field[i1][j1] = field[i2][j2];
					field[i2][j2] = t;
					deselect(i1, j1, field[i1][j1]);
					deselect(i2, j2, field[i2][j2]);
				}
			}
			clicks = 0;
		}
	}

	function disappearTime(i, j) {
		setTimeout(() => {
			ctx.beginPath();
			ctx.rect(j*d, i*d, d, d);
			ctx.fillStyle = backgroundcolor;
			ctx.fill();
			ctx.strokeStyle = borderscolor;
			ctx.stroke();
		}, 230);
	}

	function drawTime(i, j, type) {
		setTimeout(() => {
			drawOne(i, j, type);
		}, 300)
	}
}