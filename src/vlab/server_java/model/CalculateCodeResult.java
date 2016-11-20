package vlab.server_java.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import vlab.server_java.model.util.HtmlParamEscaper;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import static java.math.BigDecimal.ROUND_HALF_UP;
import static vlab.server_java.model.util.HtmlParamEscaper.shrink;

public class CalculateCodeResult {

    private final List<Row> table;

    @JsonCreator
    public CalculateCodeResult(@JsonProperty("table") List<BigDecimal[]> table) {
        this.table = table.stream().map(Row::new).collect(Collectors.toList());
    }

    @JsonProperty("table")
    public List<BigDecimal[]> getTable() {
        return table.stream().map(Row::getRow).collect(Collectors.toList());
    }

    public static class Row{
        private final BigDecimal t;
        private final BigDecimal q_1;
        private final BigDecimal q_2;
        private final BigDecimal q_3;
        private final BigDecimal q_4;

        @JsonCreator
        public Row(BigDecimal[] values) {
            this.t = shrink(values[0]);
            this.q_1 = shrink(values[1]);
            this.q_2 = shrink(values[2]);
            this.q_3 = shrink(values[3]);
            this.q_4 = shrink(values[4]);
        }

        public BigDecimal[] getRow() {
            return new BigDecimal[]{t, q_1, q_2, q_3, q_4};
        }

    }
}
