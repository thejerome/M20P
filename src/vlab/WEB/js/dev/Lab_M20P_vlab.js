function init_lab() {
    var container,
        default_animation_data = {table: [
            [0.01, 0.3, 3.5, 4, 6],
            [1.01, 0.8, 3.5, 5, 6],
            [2.02, 1.2, 3.6, 5.6, 8]
        ]},
        help_slide_number = 0,
        lab_animation_data = [],
        experiment_time = 15,
        help_active = false,
        graphics_active = false,
        default_variant = {
            "mass_1":  30,
            "mass_2":  15,
            "mass_3":  8,
            "mass_4":  6,
            "time":  7
        },
        lab_variant,
        btn_stop_blocked = true,
        btn_launch_blocked = false,
        controls_blocked = false,
        show_graphics_blocked = false,
        robot_timeout,
        clock_timeout,
        LEFT_BOUND_TIME = 1,
        RIGHT_BOUND_TIME = 30,
        window = '<div class="vlab_setting"><div class="block_title"><div class="vlab_name">Динамика манипулятора М20П' +
            '</div><input class="btn_help btn" type="button" value="Справка"/></div><div class="block_robot">' +
            '<div class="robot_scheme"></div>' +
            '<div class="robot_graphics"><canvas class="robot_graphics_canvas" width="80" height="50"></canvas><div class="waiting_loading">' +
            '<img src="img/Lab_M20P_hourglass.png" width="38" height="38"/></div></div>' +
            '<div class="robot_clock">00:<span class="clock_seconds"></span>' +
            '</div></div><div class="block_control">' +
            '<div class="robot_mass1"><i>m<sub>1</sub></i>: <span class="mass1_value"></span> кг</div>' +
            '<div class="robot_mass2"><i>m<sub>2</sub></i>: <span class="mass2_value"></span> кг</div>' +
            '<div class="robot_mass3"><i>m<sub>3</sub></i>: <span class="mass3_value"></span> кг</div>' +
            '<div class="robot_mass4"><i>m<sub>4</sub></i>: <span class="mass4_value"></span> кг</div>' +
            '<div class="robot_time"><i>t<sub></sub></i>: <span class="time_value"></span> с</div>' +
            '<label for="control_duration_slider">Продолжительность эксперимента <i>S</i>:</label>' +
            '<input class="control_duration_slider" id="control_duration_slider" type="range" ' +
            'max="' + RIGHT_BOUND_TIME + '" min="' + LEFT_BOUND_TIME + '" step="1"/>' +
            '<input class="control_duration_value" type="number" step="1" min="'+ LEFT_BOUND_TIME + '" max="' + RIGHT_BOUND_TIME + '"> c' +
            '<input class="control_launch btn" type="button" value="Запустить"/>' +
            '<input class="control_stop btn" type="button" value="Стоп"/>' +
            '</div><div class="block_user_results">' +
            '<div class="results_q">' +
            '<label for="control_q1"><i>q<sub>1</sub></i>:<input class="control_q1" id="control_q1" type="number" step="0.0001"></label>' +
            '<label for="control_q2"><i>q<sub>2</sub></i>:<input class="control_q2" id="control_q2" type="number" step="0.0001"></label>' +
            '<label for="control_q3"><i>q<sub>3</sub></i>:<input class="control_q3" id="control_q3" type="number" step="0.0001"></label>' +
            '<label for="control_q4"><i>q<sub>4</sub></i>:<input class="control_q4" id="control_q4" type="number" step="0.0001"></label>' +
            '</div>' +
            '<div class="results_q_hatch">' +
            '<label for="control_q1_hatch"><i>q<sub>1</sub>\'</i>:<input class="control_q1_hatch" id="control_q1_hatch" type="number" step="0.0001"></label>' +
            '<label for="control_q2_hatch"><i>q<sub>2</sub>\'</i>:<input class="control_q2_hatch" id="control_q2_hatch" type="number" step="0.0001"></label>' +
            '<label for="control_q3_hatch"><i>q<sub>3</sub>\'</i>:<input class="control_q3_hatch" id="control_q3_hatch" type="number" step="0.0001"></label>' +
            '<label for="control_q4_hatch"><i>q<sub>4</sub>\'</i>:<input class="control_q4_hatch" id="control_q4_hatch" type="number" step="0.0001"></label>' +
            '</div>' +
            '<div class="results_q_2hatch">' +
            '<label for="control_q1_2hatch"><i>q<sub>1</sub>\'\'</i>:<input class="control_q1_2hatch" id="control_q1_2hatch" type="number" step="0.0001"></label>' +
            '<label for="control_q2_2hatch"><i>q<sub>2</sub>\'\'</i>:<input class="control_q2_2hatch" id="control_q2_2hatch" type="number" step="0.0001"></label>' +
            '<label for="control_q3_2hatch"><i>q<sub>3</sub>\'\'</i>:<input class="control_q3_2hatch" id="control_q3_2hatch" type="number" step="0.0001"></label>' +
            '<label for="control_q4_2hatch"><i>q<sub>4</sub>\'\'</i>:<input class="control_q4_2hatch" id="control_q4_2hatch" type="number" step="0.0001"></label>' +
            '</div>' +
            '</div>' +
            '<div class="block_graphics">' +
            '<input class="show_experiment_table btn" type="button" value="Таблица значений"/>' +
            '<button class="show_graphic_q1 btn" type="button"><i>q<sub>1</sub></i>(<i>t</i>)</button>' +
            '<button class="show_graphic_q2 btn" type="button"><i>q<sub>2</sub></i>(<i>t</i>)</button>' +
            '<button class="show_graphic_q3 btn" type="button"><i>q<sub>3</sub></i>(<i>t</i>)</button>' +
            '<button class="show_graphic_q4 btn" type="button"><i>q<sub>4</sub></i>(<i>t</i>)</button>' +
            '<input class="close_graphics btn" type="button" value="Вернуться"/>' +
            '<div class="experiment_table graphic">' +
            '<table class="fixed_headers"><thead><tr><th>Время <i>t</i>, с</th>' +
            '<th><i>q<sub>1</sub></i>(<i>t</i>)</th>' +
            '<th><i>q<sub>2</sub></i>(<i>t</i>)</th>' +
            '<th><i>q<sub>3</sub></i>(<i>t</i>)</th>' +
            '<th><i>q<sub>4</sub></i>(<i>t</i>)</th>' +
            '</tr></thead><tbody></tbody></table></div>' +
            '<div class="graphic_q1 graphic"><svg width="600" height="220"></svg></div>' +
            '<div class="graphic_q2 graphic"><svg width="600" height="220"></svg></div>' +
            '<div class="graphic_q3 graphic"><svg width="600" height="220"></svg></div>' +
            '<div class="graphic_q4 graphic"><svg width="600" height="220"></svg></div>' +
            '</div><div class="block_help">' +
            '<h1>Помощь по работе в виртуальной лаборатории</h1>' +
            '<p>Уважаемый слушатель массового открытого онлайн-курса «Модели и методы аналитической механики»!</p>' +
            '<p>Вы находитесь в виртуальной лаборатории, где Вашему вниманию предлагается модель промышленного робота M20P. ' +
            'Целью выполнения работы является определение  обобщенных координат, скоростей и ускорений в момент времени.</p>' +
            '<p>На рисунке изображена схема робота. <img src="img/Lab_M20P_robot.png" width="400"/> Обобщенная координата <i>q<sub>1</sub></i> соответстует углу' +
            ' поворота стойки &phi;<sub>1</sub>. ' +
            'Обобщенная координата <i>q<sub>2</sub></i> соответстует изменению расстояния <i>S</i><sub>1</sub>. Обобщенная координата <i>q<sub>3</sub></i> соответстует ' +
            'изменению расстояния <i>S</i><sub>2</sub>. ' +
            'Обобщенная координата <i>q<sub>4</sub></i> соответстует углу поворота схвата &phi;<sub>2</sub>.</p>' +
            '<p>Для проведения эксперимента Вы можете увеличить или уменьшить продолжительность эксперимента <i>S</i> с помощью движка. ' +
            'Изменение отобразится на установке. После выбора подходящего значения осуществите эксперимент, нажав на кнопку «Запустить».</p>' +
            '<p>Чтобы закончить эксперимент заранее, нажмите кнопку «Стоп». Для просмотра результатов необходимо нажать на экран на установке.</p>' +
            '<p>Чтобы посмотреть графики зависимостей обобщенных координат от времени, нажмите соответствующие кнопки. ' +
            'Точные значения следует смотреть в таблице результатов. Для перехода к ней или возвращения к установке также нажмите кнопки.</p>' +
            '<p>Занесите в нужные поля точные значения обобщенных координат, взятые из таблицы результатов. Вычислите зачения обобщенных скоростей и ускорений,' +
            ' также поместив их в ячейки. Вычисления необходимо проводить с точностью до 0,0001.</p>' +
            '<p>Желаем удачи в выполнении виртуальной лабораторной работы!</p>' +
            '</div></div>';

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(80, 1, 1, 1000);
    var renderer = new THREE.WebGLRenderer();
    var material_light_grey = new THREE.MeshBasicMaterial( {color: 0xeeeeee} );
    var material_dark_grey = new THREE.MeshBasicMaterial( {color: 0x3d4652} );
    var material_middle_grey = new THREE.MeshBasicMaterial( {color: 0xd0cdcd} );
    var material_middle_dark_grey = new THREE.MeshBasicMaterial( {color: 0xb3b2b2} );
    var part_body = new THREE.Object3D();
    var part_tong = new THREE.Object3D();
    var part_hand = new THREE.Object3D();
    var cylinder_0 = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 50, 100), material_light_grey);
    var cylinder_1 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 15, 100), material_light_grey);
    var cube_0 = new THREE.Mesh(new THREE.BoxGeometry(20, 2, 20), material_dark_grey);
    var cube_1 = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 8), material_middle_grey);
    var cube_2 = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 1), material_middle_dark_grey);
    var cube_3 = new THREE.Mesh(new THREE.BoxGeometry(5, 2, 1), material_middle_dark_grey);
    var cube_4 = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 1), material_middle_dark_grey);

    function freeze_control_block() {
        controls_blocked = true;
        btn_launch_blocked = true;
        btn_stop_blocked = true;
        $(".control_stop").addClass("not_active");
        $(".control_launch").addClass("not_active");
        $(".control_radius_slider").addClass("not_active").attr("readonly", "readonly");
        $(".control_duration_slider").addClass("not_active").attr("readonly", "readonly");
        $(".control_radius_value").addClass("not_active").attr("readonly", "readonly");
        $(".control_duration_value").addClass("not_active").attr("readonly", "readonly");
    }

    function unfreeze_control_block() {
        btn_launch_blocked = false;
        btn_stop_blocked = true;
        controls_blocked = false;
        $(".control_launch.not_active").removeClass("not_active");
        $(".control_stop").addClass("not_active");
        $(".control_radius_slider.not_active").removeAttr("readonly").removeClass("not_active");
        $(".control_duration_slider.not_active").removeAttr("readonly").removeClass("not_active");
        $(".control_radius_value.not_active").removeAttr("readonly").removeClass("not_active");
        $(".control_duration_value.not_active").removeAttr("readonly").removeClass("not_active");
    }

    function freeze_installation() {
        show_graphics_blocked = true;
        $(".robot_graphics").addClass("active_waiting");
    }

    function unfreeze_installation() {
        show_graphics_blocked = false;
        $(".robot_graphics").removeClass("active_waiting");
    }

    function stop_animation() {
        clearTimeout(robot_timeout);
        clearTimeout(clock_timeout);
        draw_robot(0, 0, 0, 0);
        put_seconds(0);
        unfreeze_control_block();
    }

    function draw_robot(q_1, q_2, q_3, q_4) {
        var first_length = 4.1;
        if (q_2 > 18){
            q_2 = 18
        }
        if (q_3 > 18){
            q_3 = 18
        }
        part_hand.remove(cylinder_1);
        cylinder_1 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, q_3, 100), material_light_grey);
        part_hand.add(cylinder_1);
        part_body.rotation.y = Math.PI / 8;
        cube_0.position.y = -25;
        cylinder_1.position.z = first_length + q_3 / 4;
        cylinder_1.rotation.x = Math.PI/2;
        cube_2.position.z = 1.5;
        cube_2.position.x = -2.5;
        cube_4.position.x = 2.5;
        cube_4.position.z = 1.5;
        cube_2.rotation.y = Math.PI/2;
        cube_4.rotation.y = Math.PI/2;
        part_tong.position.z = cylinder_1.position.z +  q_3 / 2;
        part_tong.rotation.z = -q_4;
        part_hand.position.y = q_2;
        part_hand.rotation.y = q_1;
        renderer.render(scene, camera);
    }

    function animate_robot(data, i) {
        var diff_time;
        if (i === 0) {
            diff_time = data[i][0] * 1000;
        } else {
            diff_time = (data[i][0] - data[i - 1][0]) * 1000;
        }
        i++;
        if (i < data.length) {
            robot_timeout = setTimeout(function () {
                draw_robot(data[i][1], data[i][2], data[i][3], data[i][4]);
                animate_robot(data, i);
            }, diff_time);
        } else {
            robot_timeout = setTimeout(function () {
                draw_robot(data[data.length-1][1], data[data.length-1][2], data[data.length-1][3], data[data.length-1][4]);
                unfreeze_control_block();
            }, diff_time);
        }
    }

    function draw_small_plot() {
        var canvas = $(".robot_graphics_canvas")[0];
        var ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(5, canvas.height - 5);
        ctx.lineTo(75, canvas.height - 5);
        ctx.moveTo(5, canvas.height - 5);
        ctx.lineTo(5, 5);
        ctx.stroke();
        ctx.strokeStyle = '#af261c';
        ctx.beginPath();
        ctx.moveTo(5, canvas.height - 5);
        ctx.lineTo(75, 5);
        ctx.stroke();
    }

    function init_experiment_table(table_selector, data) {
        $(table_selector).empty();
        for (var i = 0; i < data.length; i++) {
            $(table_selector).append("<tr><td>" + data[i][0].toFixed(2) + "</td><td><span class='cell_right_align'>" + data[i][1].toFixed(4) +
                "</span></td><td><span class='cell_right_align'>" + data[i][2].toFixed(4) + "</span></td>" +
                "<td><span class='cell_right_align'>" + data[i][3].toFixed(4) + "</span></td>" +
                "<td><span class='cell_right_align'>" + data[i][4].toFixed(4) + "</span></td></tr>");
        }
    }

    function init_plot(data, plot_selector, y_coefficient) {
        $(plot_selector).empty();
        var vis = d3.select(plot_selector),
            WIDTH = 600,
            HEIGHT = 220,
            MARGINS = {
                top: 20,
                right: 20,
                bottom: 20,
                left: 50
            },

            xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data, function (d) {
                return d[0];
            }),
                d3.max(data, function (d) {
                    return d[0];
                })
            ]),

            yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(data, function (d) {
                return d[y_coefficient];
            }),
                d3.max(data, function (d) {
                    return d[y_coefficient];
                })
            ]),

            xAxis = d3.svg.axis()
                .scale(xRange)
                .tickSize(5)
                .tickSubdivide(true),

            yAxis = d3.svg.axis()
                .scale(yRange)
                .tickSize(5)
                .orient("left")
                .tickSubdivide(true),

            lineFunc = d3.svg.line()
                .x(function (d) {
                    return xRange(d[0]);
                })
                .y(function (d) {
                    return yRange(d[y_coefficient]);
                })
                .interpolate('basis');

        vis.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);

        vis.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);

        vis.append("svg:path")
            .attr("d", lineFunc(data))
            .attr("stroke", "#af261c")
            .attr("stroke-width", 2)
            .attr("fill", "none");
    }

    function show_graphics_block() {
        if (!show_graphics_blocked) {
            if (!graphics_active) {
                graphics_active = true;
                $(".block_graphics").css("display", "block");
            } else {
                graphics_active = false;
                $(".block_graphics").css("display", "none");
            }
        }
    }

    function show_help() {
        if (!help_active) {
            help_active = true;
            $(".block_help").css("display", "block");
            $(".btn_help").attr("value", "Вернуться");
        } else {
            help_active = false;
            $(".block_help").css("display", "none");
            $(".btn_help").attr("value", "Справка");
        }
    }

    function show_graphic(graphic_show) {
        $(".graphic").css("display", "none");
        $(graphic_show).css("display", "block");
    }

    function animate_clock(t) {
        if (t >= 1) {
            clock_timeout = setTimeout(function () {
                t--;
                put_seconds(t);
                animate_clock(t)
            }, 1000);
        }
    }

    function put_seconds(sec) {
        var sec_str;
        if (sec < 10) {
            sec_str = "0" + sec;
        } else {
            sec_str = sec;
        }
        $(".clock_seconds").html(sec_str);
    }

    function animate_installation() {
        put_seconds(experiment_time);
        animate_clock(experiment_time);
        animate_robot(lab_animation_data, 0);
    }

    function launch() {
        freeze_control_block();
        freeze_installation();
        ANT.calculate();
    }

    function change_duration_value() {
        $(".control_duration_value").val($(".control_duration_slider").val());
        experiment_time = $(".control_duration_slider").val();
        put_seconds(experiment_time);
    }

    function change_duration_slider() {
        $(".control_duration_slider").val($(".control_duration_value").val());
        experiment_time = $(".control_duration_value").val();
        put_seconds(experiment_time);
    }

    function parse_calculate_results(str, def_obj) {
        var parse_str;
        if (typeof str === 'string' && str !== "") {
            try {
                parse_str = str.replace(/<br\/>/g, "\r\n").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&lt;br\/&gt;/g, "\r\n")
                    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&minus;/g, "-").replace(/&apos;/g, "\'").replace(/&#0045;/g, "-");
                parse_str = JSON.parse(parse_str);
            } catch (e) {
                if (def_obj){
                    parse_str = def_obj;
                } else {
                    parse_str = false;
                }
            }
        } else {
            if (def_obj){
                parse_str = def_obj;
            } else {
                parse_str = false;
            }
        }
        return parse_str;
    }

    function get_variant() {
        var variant;
        if ($("#preGeneratedCode") !== null) {
            variant = parse_calculate_results($("#preGeneratedCode").val(), default_variant);
        } else {
            variant = default_variant;
        }
        return variant;
    }

    function draw_previous_solution(previous_solution) {
        $(".control_q1").val(previous_solution.q[0]);
        $(".control_q2").val(previous_solution.q[1]);
        $(".control_q3").val(previous_solution.q[2]);
        $(".control_q4").val(previous_solution.q[3]);
        $(".control_q1_hatch").val(previous_solution.q_hatch[0]);
        $(".control_q2_hatch").val(previous_solution.q_hatch[1]);
        $(".control_q3_hatch").val(previous_solution.q_hatch[2]);
        $(".control_q4_hatch").val(previous_solution.q_hatch[3]);
        $(".control_q1_2hatch").val(previous_solution.q_2hatch[0]);
        $(".control_q2_2hatch").val(previous_solution.q_2hatch[1]);
        $(".control_q3_2hatch").val(previous_solution.q_2hatch[2]);
        $(".control_q4_2hatch").val(previous_solution.q_2hatch[3]);
    }

    return {
        init: function () {
            lab_variant = get_variant();
            container = $("#jsLab")[0];
            container.innerHTML = window;
            renderer.setClearColor(0xffffff);
            renderer.setSize(300, 300);
            camera.position.z = 45;
            $(".robot_scheme").append(renderer.domElement);
            scene.add(part_body);
            part_tong.add(cube_2);
            part_tong.add(cube_3);
            part_tong.add(cube_4);
            part_hand.add(cube_1);
            part_hand.add(cylinder_1);
            part_hand.add(part_tong);
            part_body.add(cube_0);
            part_body.add(cylinder_0);
            part_body.add(part_hand);
            draw_robot(0, 15, 15, 0);
            $(".control_stop").addClass("not_active");
            $(".mass1_value").html(lab_variant.mass_1);
            $(".mass2_value").html(lab_variant.mass_2);
            $(".mass3_value").html(lab_variant.mass_3);
            $(".mass4_value").html(lab_variant.mass_4);
            $(".time_value").html(lab_variant.time);
            $("#control_duration_slider").attr("value", experiment_time);
            $(".control_duration_value").attr("value", experiment_time);
            put_seconds(experiment_time);
            draw_small_plot();
            if ($("#previousSolution") !== null && $("#previousSolution").length > 0 && parse_calculate_results($("#previousSolution").val())) {
                var previous_solution = parse_calculate_results($("#previousSolution").val());
                draw_previous_solution(previous_solution);
            }
            $(".control_launch").on("click", function () {
                if (!btn_launch_blocked) {
                    launch();
                }
            });
            $(".control_duration_slider").change(function () {
                if (!controls_blocked) {
                    change_duration_value();
                }
            });
            $(".control_duration_value").change(function () {
                if (!controls_blocked) {
                    if ($(this).val() < LEFT_BOUND_TIME) {
                        $(this).val(LEFT_BOUND_TIME)
                    } else if($(this).val() > RIGHT_BOUND_TIME){
                        $(this).val(RIGHT_BOUND_TIME)
                    }
                    change_duration_slider();
                }
            });
            $(".btn_help").click(function () {
                show_help();
            });
            $(".robot_graphics").click(function () {
                show_graphics_block();
            });
            $(".close_graphics").click(function () {
                show_graphics_block();
            });
            $(".show_experiment_table").click(function () {
                show_graphic(".experiment_table");
            });
            $(".show_graphic_q1").click(function () {
                show_graphic(".graphic_q1");
            });
            $(".show_graphic_q2").click(function () {
                show_graphic(".graphic_q2");
            });
            $(".show_graphic_q3").click(function () {
                show_graphic(".graphic_q3");
            });
            $(".show_graphic_q4").click(function () {
                show_graphic(".graphic_q4");
            });
            $(".control_stop").click(function () {
                if (!btn_stop_blocked) {
                    stop_animation();
                }
            });
            $(".slide_next").click(function () {
                if (help_slide_number < 6) {
                    help_slide_number ++;
                    $(".slide_back").removeClass("not_active");
                    $(".help_slide").css("display", "none");
                    $(".help_slide.slide_" + help_slide_number).css("display", "block");
                    if (help_slide_number === 6) {
                        $(this).addClass("not_active")
                    }
                }
            });
            $(".slide_back").click(function () {
                if (help_slide_number > 0) {
                    help_slide_number --;
                    $(".slide_next").removeClass("not_active");
                    $(".help_slide").css("display", "none");
                    $(".help_slide.slide_" + help_slide_number).css("display", "block");
                    if (help_slide_number === 0) {
                        $(this).addClass("not_active")
                    }
                }
            });
        },
        calculateHandler: function () {
            lab_animation_data = parse_calculate_results(arguments[0], default_animation_data);
            lab_animation_data = lab_animation_data.table;
            init_plot(lab_animation_data, ".graphic_q1 svg", 1);
            init_plot(lab_animation_data, ".graphic_q2 svg", 2);
            init_plot(lab_animation_data, ".graphic_q3 svg", 3);
            init_plot(lab_animation_data, ".graphic_q4 svg", 4);
            init_experiment_table(".experiment_table table tbody", lab_animation_data);
            unfreeze_installation();
            btn_stop_blocked = false;
            $(".control_stop.not_active").removeClass("not_active");
            animate_installation();
        },
        getResults: function () {
            var answer = {
                q: [$(".control_q1").val(), $(".control_q2").val(), $(".control_q3").val(), $(".control_q4").val()],
                q_hatch: [$(".control_q1_hatch").val(), $(".control_q2_hatch").val(), $(".control_q3_hatch").val(), $(".control_q4_hatch").val()],
                q_2hatch: [$(".control_q1_2hatch").val(), $(".control_q2_2hatch").val(), $(".control_q3_2hatch").val(), $(".control_q4_2hatch").val()]
            };
            return JSON.stringify(answer);
        },
        getCondition: function () {
            var condition;
            condition = {
                "S": experiment_time
            };
            return JSON.stringify(condition);
        }
    }
}

var Vlab = init_lab();