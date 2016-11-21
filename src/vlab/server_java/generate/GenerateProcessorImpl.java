package vlab.server_java.generate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import rlcp.generate.GeneratingResult;
import rlcp.server.processor.generate.GenerateProcessor;
import vlab.server_java.model.GenerateCodeResult;
import vlab.server_java.model.GenerateInstructionsResult;
import vlab.server_java.model.CalculateMethod;


import java.math.BigDecimal;
import java.util.Random;

import static vlab.server_java.model.util.HtmlParamEscaper.escapeParam;

/**
 * Simple GenerateProcessor implementation. Supposed to be changed as needed to
 * provide necessary Generate method support.
 */
public class GenerateProcessorImpl implements GenerateProcessor {

    Random random = new Random(System.nanoTime());

    @Override
    public GeneratingResult generate(String condition) {
        ObjectMapper mapper = new ObjectMapper();

        String text = "Ваш вариант загружен в установку";
        String code = null;
        String instructions = null;
        try {
            int mass_4 = getRandomIntegerBetween(5, 25);
            int mass_3 = getRandomIntegerBetween(mass_4, mass_4 + 20);
            int mass_2 = getRandomIntegerBetween(mass_3 + mass_4, mass_3 + mass_4 + 30);
            int mass_1 = getRandomIntegerBetween(mass_2 + mass_3 + mass_4, mass_2 + mass_3 + mass_4 + 50);
            int time = getRandomIntegerBetween(10, 30);
            double q_1 = CalculateMethod.calculate_q_1(time, mass_1, mass_2, mass_3, mass_4);
            double q_2 = CalculateMethod.calculate_q_2(time, mass_1, mass_2, mass_3, mass_4);
            double q_3 = CalculateMethod.calculate_q_3(time, mass_1, mass_2, mass_3, mass_4);
            double q_4 = CalculateMethod.calculate_q_4(time, mass_1, mass_2, mass_3, mass_4);
            double q_hatch_1 = CalculateMethod.calculate_q_hatch_1(time, mass_1, mass_2, mass_3, mass_4);
            double q_hatch_2 = CalculateMethod.calculate_q_hatch_2(time, mass_1, mass_2, mass_3, mass_4);
            double q_hatch_3 = CalculateMethod.calculate_q_hatch_3(time, mass_1, mass_2, mass_3, mass_4);
            double q_hatch_4 = CalculateMethod.calculate_q_hatch_4(time, mass_1, mass_2, mass_3, mass_4);
            double q_2hatch_1 = CalculateMethod.calculate_q_2hatch_1(time, mass_1, mass_2, mass_3, mass_4);
            double q_2hatch_2 = CalculateMethod.calculate_q_2hatch_2(time, mass_1, mass_2, mass_3, mass_4);
            double q_2hatch_3 = CalculateMethod.calculate_q_2hatch_3(time, mass_1, mass_2, mass_3, mass_4);
            double q_2hatch_4 = CalculateMethod.calculate_q_2hatch_4(time, mass_1, mass_2, mass_3, mass_4);

            code = mapper.writeValueAsString(
                    new GenerateCodeResult(
                            new BigDecimal(mass_1),
                            new BigDecimal(mass_2),
                            new BigDecimal(mass_3),
                            new BigDecimal(mass_4),
                            new BigDecimal(time)
                    )
            );
            instructions = mapper.writeValueAsString(
                    new GenerateInstructionsResult(
                            new BigDecimal[]{
                                    new BigDecimal(q_1),
                                    new BigDecimal(q_2),
                                    new BigDecimal(q_3),
                                    new BigDecimal(q_4)
                            },
                            new BigDecimal[]{
                                    new BigDecimal(q_hatch_1),
                                    new BigDecimal(q_hatch_2),
                                    new BigDecimal(q_hatch_3),
                                    new BigDecimal(q_hatch_4)
                            },
                            new BigDecimal[]{
                                    new BigDecimal(q_2hatch_1),
                                    new BigDecimal(q_2hatch_2),
                                    new BigDecimal(q_2hatch_3),
                                    new BigDecimal(q_2hatch_4)
                            }
                    )
            );
        } catch (JsonProcessingException e) {
            code = "Failed, " + e.getOriginalMessage();
        }
        return new GeneratingResult(text, escapeParam(code), escapeParam(instructions));
    }

    private int getRandomIntegerBetween(int a, int b) {
        return (a + random.nextInt(b - a + 1));
    }


}
