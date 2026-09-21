import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hardware Management & IoT',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
        ),
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<dynamic> computers = [];
  bool loading = false;
  String message = '';

  Future<void> loadComputers() async {
    setState(() {
      loading = true;
      message = '';
    });

    try {
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/computers'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        setState(() {
          computers = data['computers'];
          loading = false;
        });
      } else {
        setState(() {
          loading = false;
          message = 'Backend error: ${response.statusCode}';
        });
      }
    } catch (e) {
      setState(() {
        loading = false;
        message = 'Connection failed: $e';
      });
    }
  }

  @override
  void initState() {
    super.initState();
    loadComputers();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hardware Management & IoT'),
      ),
      body: loading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : computers.isEmpty
              ? Center(
                  child: Text(
                    message.isEmpty
                        ? 'No computers found'
                        : message,
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: computers.length,
                  itemBuilder: (context, index) {
                    final computer = computers[index];

                    return Card(
                      child: ListTile(
                        title: Text(
                          computer['name'] ?? 'Unknown PC',
                        ),
                        subtitle: Text(
                          'Status: ${computer['status']}\n'
                          'IP: ${computer['ipAddress'] ?? 'N/A'}\n'
                          'Location: ${computer['location'] ?? 'N/A'}',
                        ),
                        leading: const Icon(
                          Icons.computer,
                        ),
                      ),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: loadComputers,
        child: const Icon(Icons.refresh),
      ),
    );
  }
}