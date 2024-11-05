import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useCreateAxios from "@hooks/axiosHook";
import { useFocusEffect } from "expo-router";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@constants/Colors";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function OrderStatistic() {
  const { createRequest } = useCreateAxios();
  const [selectedWeek, setSelectedWeek] = useState();
  const [selectedYear, setSelectedYear] = useState();
  const [weekAndYearAvailable, setWeekAndYearAvaiLabel] = useState([]);
  const [weekAvailable, setWeekAvaiLabel] = useState([]);
  const [yearAvalable, setYearAvailable] = useState([]);
  const [dataBarChart, setDataBarChart] = useState();
  const [dataLineChart, setDataLineChart] = useState();
  const [dataChart, setDataChart] = useState();
  useFocusEffect(
    useCallback(() => {
      const fetchWeekAvailable = async () => {
        try {
          let response: any = await createRequest(
            "get",
            "/orders/getAvailableWeeks",
            {}
          );
          setWeekAndYearAvaiLabel(response.data.availableWeeks);
          const uniqueYears: any = Array.from(
            new Set(response.data.availableWeeks.map((item: any) => item.year))
          );
          setYearAvailable(uniqueYears);

          if (response.data.availableWeeks.length > 0) {
            const firstEntry = response.data.availableWeeks[0];
            setSelectedYear(firstEntry.year);
            setSelectedWeek(firstEntry.week);
          }
          console.log("Available Weeks:", response.data);
        } catch (error: any) {
          console.log(error);
        }
      };

      fetchWeekAvailable();
    }, [])
  );

  useEffect(() => {
    if (selectedYear) {
      const filteredWeeks: any = weekAndYearAvailable
        .filter((item: any) => item.year === selectedYear)
        .map((item: any) => item.week);
      setWeekAvaiLabel(filteredWeeks);

      if (filteredWeeks.length > 0) {
        setSelectedWeek(filteredWeeks[0]);
      }
    }
  }, [selectedYear, weekAndYearAvailable]);

  useEffect(() => {
    if (selectedWeek) {
      const fetchOrderByWeek = async () => {
        console.log(selectedWeek);
        console.log(selectedYear);
        try {
          let response: any = await createRequest(
            "post",
            "/orders/getOrderByWeek",
            {
              week: selectedWeek,
              year: selectedYear,
            }
          );
          setDataChart(response.data);
          console.log("Order:", response.data);
          let data: any = {
            labels: Object.keys(response.data).map((date) => {
              const parts = date.split("-");
              return parts.length > 2 ? `${parts[2]}/${parts[1]}` : date;
            }),
            datasets: [
              {
                data: Object.keys(response.data).map(
                  (date) => response.data[date].total_price
                ),
              },
            ],
          };

          setDataLineChart(data);
          data = {
            labels: Object.keys(response.data).map((date) => {
              const parts = date.split("-");
              return parts.length > 2 ? `${parts[2]}/${parts[1]}` : date;
            }),
            datasets: [
              {
                data: Object.keys(response.data).map(
                  (date) => response.data[date].count
                ),
              },
            ],
          };
          setDataBarChart(data);
        } catch (error: any) {
          console.log(error);
        }
      };
      fetchOrderByWeek();
    }
  }, [selectedWeek]);
  useEffect(() => {
    // console.log("selectedWeek",selectedWeek);
  }, [selectedYear]);

  const generateExcel = () => {
    let wb = XLSX.utils.book_new();
    const excelData = [["Date", "Order Count", "Total Price"]];
    for (const [date, values] of Object.entries(dataChart)) {
      excelData.push([date, values.count, values.total_price]);
    }

    let ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, "Order Statistics", true);

    const base64 = XLSX.write(wb, { type: "base64" });
    const filename =
      FileSystem.documentDirectory + "OrderStatis" + selectedWeek + ".xlsx";

    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      Sharing.shareAsync(filename);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.flexHeader}>
        <Text style={styles.title}>Order Statistic</Text>
        <TouchableOpacity
          onPress={() => generateExcel()}
          style={styles.exportBtn}
        >
          <Text style={styles.exportBtnText}>Export Excel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chart}>
        <View style={styles.pickerRow}>
          <View style={styles.pickerContainer}>
            <Text>Select Year:</Text>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
              style={styles.picker}
            >
              {yearAvalable.map((year) => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text>Select Week:</Text>
            <Picker
              selectedValue={selectedWeek}
              onValueChange={(itemValue) => setSelectedWeek(itemValue)}
              style={styles.picker}
            >
              {weekAvailable.map((week) => (
                <Picker.Item key={week} label={week} value={week} />
              ))}
            </Picker>
          </View>
        </View>
        <Text style={styles.statisticText}>Weekly Order Revenue</Text>
        {dataLineChart && (
          <LineChart
            data={dataLineChart}
            width={400}
            height={220}
            chartConfig={{
              backgroundColor: Colors.IVORYWHITE,
              backgroundGradientFrom: Colors.IVORYWHITE,
              backgroundGradientTo: Colors.IVORYWHITE,
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        )}
        <Text style={styles.statisticText}>Total Orders for the Week</Text>
        {dataBarChart && (
          <BarChart
            data={dataBarChart}
            width={390}
            height={180}
            chartConfig={{
              backgroundColor: Colors.IVORYWHITE,
              backgroundGradientFrom: Colors.IVORYWHITE,
              backgroundGradientTo: Colors.IVORYWHITE,
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flexHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  exportBtn: {
    borderRadius: 10,
    backgroundColor: "green",
  },
  exportBtnText: {
    fontSize: 14,
    fontFamily: "inter",
    padding: 10,
    color: Colors.IVORYWHITE,
  },
  statisticText: {
    fontFamily: "inter-bold",
    fontSize: 20,
    color: Colors.CHOCOLATEBROWN,
  },
  chart: {
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "unna-bold",
    color: Colors.CHOCOLATEBROWN,
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  picker: {
    height: 50,
    width: "90%",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
