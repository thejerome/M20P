package vlab.server_java.check;

import com.fasterxml.jackson.databind.ObjectMapper;
import rlcp.check.ConditionForChecking;
import rlcp.generate.GeneratingResult;
import rlcp.server.processor.check.PreCheckProcessor.PreCheckResult;
import rlcp.server.processor.check.PreCheckResultAwareCheckProcessor;
import vlab.server_java.model.*;

import java.math.BigDecimal;

import static vlab.server_java.model.util.HtmlParamEscaper.prepareInputJsonString;

public class CheckProcessorImpl implements PreCheckResultAwareCheckProcessor<String> {
    @Override
    public CheckingSingleConditionResult checkSingleCondition(ConditionForChecking condition, String instructions, GeneratingResult generatingResult) throws Exception {
        BigDecimal points = new BigDecimal("1.0");
        String comment = "";
        try {
            instructions = prepareInputJsonString(instructions);
            generatingResult = new GeneratingResult(
                    generatingResult.getText(),
                    prepareInputJsonString(generatingResult.getCode()),
                    prepareInputJsonString(generatingResult.getInstructions())
            );
            ObjectMapper mapper = new ObjectMapper();
            GenerateInstructionsResult checkTask = mapper.readValue(instructions, GenerateInstructionsResult.class);
            GenerateInstructionsResult varInstr = mapper.readValue(generatingResult.getInstructions(), GenerateInstructionsResult.class);
            boolean checkQ = true, checkQHatch = true, checkQ2Hatch = true;
            for (int i = 0; i < checkTask.getQ().length; i++){
                if (! checkTask.getQ()[i].equals(varInstr.getQ()[i])){
                    checkQ = false;
                }
                if (! checkTask.getQHatch()[i].equals(varInstr.getQHatch()[i])){
                    checkQHatch = false;
                }
                if (! checkTask.getQ2Hatch()[i].equals(varInstr.getQ2Hatch()[i])){
                    checkQ2Hatch = false;
                }
            }
            if (!(checkQ && checkQHatch && checkQ2Hatch)){
                comment += "Решение неверно. ";
                if (!checkQ){
                    points = points.subtract(new BigDecimal("0.33"));
                    comment += "Ваш ответ: q = [" + checkTask.getQ()[0] + checkTask.getQ()[1] + checkTask.getQ()[2] + checkTask.getQ()[3] + "]," +
                            " правильный ответ: q = [" + varInstr.getQ()[0] + varInstr.getQ()[1] + varInstr.getQ()[2] + varInstr.getQ()[3] + "]. ";
                }
                if (!checkQHatch){
                    points = points.subtract(new BigDecimal("0.33"));
                    comment += "Ваш ответ: q' = [" + checkTask.getQHatch()[0] + checkTask.getQHatch()[1] + checkTask.getQHatch()[2] + checkTask.getQHatch()[3] + "], " +
                            "правильный ответ: q' = [" + varInstr.getQHatch()[0] + varInstr.getQHatch()[1] + varInstr.getQHatch()[2] + varInstr.getQHatch()[3] + "]. ";
                }
                if (!checkQ2Hatch){
                    points = points.subtract(new BigDecimal("0.34"));
                    comment += "Ваш ответ: q'' = [" + checkTask.getQ2Hatch()[0] + checkTask.getQ2Hatch()[1] + checkTask.getQ2Hatch()[2] + checkTask.getQ2Hatch()[3] +
                            "], правильный ответ: q'' = [" + varInstr.getQ2Hatch()[0] + varInstr.getQ2Hatch()[1] + varInstr.getQ2Hatch()[2] + varInstr.getQ2Hatch()[3] + "]. ";
                }
            } else {
                comment = "Решение верно";
            }
        } catch(Exception e){
            points = points.subtract(new BigDecimal("1.0"));
            comment = "Failed, " + e.getMessage();
        }
        return new CheckingSingleConditionResult(points, comment);
    }

    @Override
    public void setPreCheckResult(PreCheckResult<String> preCheckResult) {}
}
