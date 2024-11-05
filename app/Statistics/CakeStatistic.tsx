import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import useCreateAxios from "@hooks/axiosHook";
import { Colors } from "@constants/Colors";

interface SaleData {
  cake_name: string;
  totalSold: number;
  revenue: number;
}

const CakeStatistic: React.FC = () => {
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const { createRequest } = useCreateAxios();
  const animationValue = new Animated.Value(0); // Khởi tạo giá trị animation

  const fetchSalesData = async (month: number, year: number) => {
    try {
      const response: AxiosResponse<SaleData[]> = await createRequest(
        "post",
        "/cakes/statistic",
        { month, year }
      );
      setSalesData(response.data);
    } catch (error) {
      console.error("Failed to fetch sales data", error);
    }
  };

  useEffect(() => {
    fetchSalesData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // Bắt đầu animation khi có dữ liệu mới
  useEffect(() => {
    if (salesData.length > 0) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 1000, // Thời gian animation
        useNativeDriver: true, // Sử dụng native driver cho hiệu suất tốt hơn
      }).start();
    }
  }, [salesData]);

  const pieChartData = salesData.map((item) => ({
    name: item.cake_name,
    quantity: item.totalSold,
    color: `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  const colors = pieChartData.map((item) => item.color);

  const barChartData = {
    labels: salesData.map((item) => item.cake_name.split(" ")[0]),
    datasets: [
      {
        data: salesData.map((item) => item.revenue.toFixed(2)),
        colors: colors.map(
          (color) =>
            (opacity = 1) =>
              `${color}`
        ),
      },
    ],
  };

  const animatedStyle = {
    opacity: animationValue,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Month To See Sell Chart</Text>

      <View style={styles.pickers}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Tháng hiện tại" value={new Date().getMonth()} />
          {Array.from({ length: 12 }, (_, i) => (
            <Picker.Item key={i} label={`Tháng ${i + 1}`} value={i} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Năm hiện tại" value={new Date().getFullYear()} />
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return <Picker.Item key={year} label={`${year}`} value={year} />;
          })}
        </Picker>
      </View>

      {salesData.length > 0 ? (
        <View>
          <View style={styles.chartContainer}>
            <Animated.View style={animatedStyle}>
              <PieChart
                data={pieChartData}
                width={290}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                hasLegend={false}
                accessor="quantity"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Animated.View>
            <View style={styles.legend}>
              {pieChartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={styles.legendText}>
                    {item.name}: {item.quantity}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ width: 370, margin: "auto" }}
          >
            <View style={styles.barChartContainer}>
              <Animated.View style={animatedStyle}>
                <BarChart
                  withCustomBarColorFromData
                  flatColor
                  data={barChartData}
                  yAxisLabel="$"
                  width={
                    (Dimensions.get("window").width / 6) * salesData.length
                  }
                  height={250}
                  chartConfig={{
                    backgroundColor: Colors.BRICKRED,
                    backgroundGradientFrom: Colors.IVORYWHITE,
                    backgroundGradientTo: Colors.FOGGYGRAY,
                    color: (opacity = 1, index) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    // propsForLabels: {
                    //   fontSize: 10, // Giảm kích thước chữ
                    // },
                    paddingRight: 30,
                  }}
                  showValuesOnTopOfBars
                  yAxisSuffix=""
                  fromZero
                  // verticalLabelRotation={8} // Xoay nhãn
                />
              </Animated.View>
            </View>
          </ScrollView>
        </View>
      ) : (
        <Text style={styles.noDataText}>None data for this month!!!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.IVORYWHITE,
  },
  pickers: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  barChartContainer: {
    marginTop: 70,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.CHOCOLATEBROWN,
  },
  picker: {
    height: 50,
    width: 150,
    marginBottom: 20,
  },
  noDataText: {
    textAlign: "center",
    color: Colors.BURGUNDYRED,
    marginTop: 20,
    fontSize: 20,
  },
  legend: {
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 100,
  },
  legendText: {
    fontSize: 14,
  },
});

export default CakeStatistic;
