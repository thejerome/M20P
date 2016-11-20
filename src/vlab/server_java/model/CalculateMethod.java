package vlab.server_java.model;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CalculateMethod {

    final static double g = 9.81;
    final static double Q_1 = 1;
    final static double Q_4 = 0.001;

    public CalculateCodeResult calculate(CalculateTask task, GenerateCodeResult variantCode, GenerateInstructionsResult variantInstr) {


        final double timeStep = 0.02;
        final double timeLimit = task.getS().doubleValue();
        final double mass_1 = variantCode.getMass_1().doubleValue();
        final double mass_2 = variantCode.getMass_2().doubleValue();
        final double mass_3 = variantCode.getMass_3().doubleValue();
        final double mass_4 = variantCode.getMass_4().doubleValue();
        double time, q_1, q_2, q_3, q_4;

        time = 0;

        List<BigDecimal[]> rows = new ArrayList<>();

        q_1 = calculate_q_1(time, mass_1, mass_2, mass_3, mass_4);
        q_2 = calculate_q_2(time, mass_1, mass_2, mass_3, mass_4);
        q_3 = calculate_q_3(time, mass_1, mass_2, mass_3, mass_4);
        q_4 = calculate_q_4(time, mass_1, mass_2, mass_3, mass_4);

        rows.add(new BigDecimal[]{new BigDecimal(time), new BigDecimal(q_1), new BigDecimal(q_2), new BigDecimal(q_3),
                new BigDecimal(q_4)});
        for(; time < timeLimit; time += timeStep){

            q_1 = calculate_q_1(time + timeStep, mass_1, mass_2, mass_3, mass_4);
            q_2 = calculate_q_2(time + timeStep, mass_1, mass_2, mass_3, mass_4);
            q_3 = calculate_q_3(time + timeStep, mass_1, mass_2, mass_3, mass_4);
            q_4 = calculate_q_4(time + timeStep, mass_1, mass_2, mass_3, mass_4);

            BigDecimal[] row = {new BigDecimal(time + timeStep), new BigDecimal(q_1), new BigDecimal(q_2), new BigDecimal(q_3),
                    new BigDecimal(q_4)};
            rows.add(row);
        }
        return new CalculateCodeResult(rows);
    }

    public static double calculate_q_1(double time, double mass_1, double mass_2, double mass_3, double mass_4){
        return 100*Q_1*Math.pow(time, 2) / (mass_1 + 494.48*(mass_2 + mass_3 + mass_4));
    }

    public static double calculate_q_2(double time, double mass_1, double mass_2, double mass_3, double mass_4){
        final double Q_2 = 9.85*(mass_2 + mass_3 + mass_4);
        return (-0.5*g*mass_2*Math.pow(time, 2) - 0.5*g*mass_3*Math.pow(time, 2) - 0.5*g*mass_4*Math.pow(time, 2) +
        0.1*(mass_2 + mass_3 + mass_4) + 0.5*Q_2*Math.pow(time, 2)) / (mass_2 + mass_3 + mass_4);
    }

    public static double calculate_q_3(double time, double mass_1, double mass_2, double mass_3, double mass_4){
        final double Q_3 = 9.85*(mass_3 + mass_4);
        return (-0.5*g*mass_3*Math.pow(time, 2) - 0.5*g*mass_4*Math.pow(time, 2) +
                0.1*(mass_3 + mass_4) + 0.5*Q_3*Math.pow(time, 2)) / (mass_3 + mass_4);
    }

    public static double calculate_q_4(double time, double mass_1, double mass_2, double mass_3, double mass_4){
        return 100*Q_4*Math.pow(time, 2) / mass_4;
    }

    public static double calculate_q_hatch_1(double time, double mass_1, double mass_2, double mass_3, double mass_4){
        return 200*Q_1*time / (mass_1 + 494.48*(mass_2 + mass_3 + mass_4));
    }

    public static double calculate_q_hatch_2(double time, double mass_1, double mass_2, double mass_3, double mass_4){
        final double Q_2 = 9.85*(mass_2 + mass_3 + mass_4);
        return (-g*mass_2*time - g*mass_3*time - g*mass_4*time + Q_2*time) / (mass_2 + mass_3 + mass_4);
    }

    public static double calculate_q_hatch_3(double time, double mass_1, double mass_2, double mass_3, double mass_4){
        final double Q_3 = 9.85*(mass_3 + mass_4);
        return (g*mass_3*time - g*mass_4*time + Q_3*time) / (mass_3 + mass_4);
    }

    public static double calculate_q_hatch_4(double time, double mass_1, double mass_2, double mass_3, double mass_4){
        return 200*Q_4*time / mass_4;
    }

    public static double calculate_q_2hatch_1(double time, double mass_1, double mass_2, double mass_3, double mass_4){
        return Q_1 / (0.005*mass_1 + 2.4724*(mass_2 + mass_3 + mass_4));
    }

    public static double calculate_q_2hatch_2(double time, double mass_1, double mass_2, double mass_3, double mass_4){
        final double Q_2 = 9.85*(mass_2 + mass_3 + mass_4);
        return (Q_2 - g*(mass_2 + mass_3 + mass_4)) / (mass_2 + mass_3 + mass_4);
    }

    public static double calculate_q_2hatch_3(double time, double mass_1, double mass_2, double mass_3, double mass_4){
        final double Q_3 = 9.85*(mass_3 + mass_4);
        return (Q_3 - g*(mass_3 + mass_4)) / (mass_3 + mass_4);
    }

    public static double calculate_q_2hatch_4(double time, double mass_1, double mass_2, double mass_3, double mass_4){
        return 200*Q_4 / mass_4;
    }

}
