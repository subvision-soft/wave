import 'package:flutter/material.dart';

class Results extends StatefulWidget {
  const Results({Key? key}) : super(key: key);

  @override
  State<Results> createState() => _ResultsState();
}

class Person {
  int id;
  String name;
  String categorie;
  int scorePre;
  int scoreBi;
  int scoreSBi;
  int scoreCombine;

  Person(
      {required this.id,
      required this.name,
      required this.categorie,
      required this.scorePre,
      required this.scoreBi,
      required this.scoreSBi,
      required this.scoreCombine});
}

enum Epreuve {
  precision,
  biathlon,
  superBiathlon,
  combine
  ;

  String getLabel() {
    switch (this) {
      case Epreuve.combine:
        return "Combine";
      case Epreuve.precision:
        return "Precision";
      case Epreuve.superBiathlon:
        return "Super\nbiathlon";
      case Epreuve.biathlon:
        return "Biathlon";
    }
  }
  String getValue(Person person) {
    switch (this) {
      case Epreuve.combine:
        return '${person.scoreCombine} pts';
      case Epreuve.precision:
        return '${person.scorePre} pts';
      case Epreuve.superBiathlon:
        return '${person.scoreSBi} pts';
      case Epreuve.biathlon:
        return '${person.scoreBi} pts';
    }
  }
}

class _ResultsState extends State<Results> {
  bool _isAscending = true;
  late int _sortColumnIndex = 0;
  late final List<Person> _persons = [
    Person(
      id: 592,
      name: "BONBEUR Jean",
      categorie: "SENIOR",
      scorePre: 5011,
      scoreBi: 3500,
      scoreSBi: 2335,
      scoreCombine: 12000,
    ),
    Person(
      id: 3434,
      name: "PARA Pente",
      categorie: "SENIOR",
      scorePre: 5233,
      scoreBi: 2322,
      scoreSBi: 4552,
      scoreCombine: 12000,
    ),
    Person(
      id: 23,
      name: "MICHEL Michel",
      categorie: "Marie",
      scorePre: 4322,
      scoreBi: 3423,
      scoreSBi: 4354,
      scoreCombine: 12000,
    ),
    Person(
      id: 21221,
      name: "MICHEL Michel",
      categorie: "SENIOR",
      scorePre: 3890,
      scoreBi: 1223,
      scoreSBi: 3454,
      scoreCombine: 12000,
    ),
  ];

  Set<Epreuve> selection = <Epreuve>{Epreuve.precision};

  @override
  Widget build(BuildContext context) {
    var myRows = _persons.map((person) {
      return DataRow(cells: [
        DataCell(Text('${person.id}')),
        DataCell(Text("${person.name}\n${person.categorie}")),
        DataCell(Text(selection.first.getValue(person))),
      ]);
    });
    int sort(a, b) {
      return _isAscending ? a.compareTo(b) : b.compareTo(a);
    }
    void onSort(int columnIndex, bool ascending) {
      switch (columnIndex) {
        case 0:
          _persons.sort((a, b) => sort(a.id, b.id));
          break;
        case 1:
          _persons.sort((a, b) => sort(a.name, b.name));
          break;
        case 2:
          _persons.sort((a, b) => sort(a.categorie, b.categorie));
          break;
        case 3:
          _persons.sort((a, b) => sort(a.scorePre, b.scorePre));
          break;
        case 4:
          _persons.sort((a, b) => sort(a.scoreBi, b.scoreBi));
          break;
        case 5:
          _persons.sort((a, b) => sort(a.scoreSBi, b.scoreSBi));
          break;
      }
      setState(() {
        _sortColumnIndex = columnIndex;
        _isAscending = ascending;
      });
    }

    return Scaffold(
        appBar: AppBar(
          title: const Text('Results'),
        ),
        body: Column(
          children: [
            SizedBox(
              width:MediaQuery.of(context).size.width,
              child: DataTable(
                  sortColumnIndex: _sortColumnIndex,
                  sortAscending: _isAscending,
                  columns: [
                    DataColumn(
                      label: const Text('ID'),
                      onSort: onSort,
                    ),
                    DataColumn(
                      label: const Text('Competiteur'),
                      onSort: onSort,
                    ),
                    DataColumn(
                      label: Text(selection.first.getLabel()),
                      onSort: onSort,
                    )
                  ],
                  rows: myRows.toList()),
            ),
            const Spacer(),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: SegmentedButton(
                style: ButtonStyle(
                    side: MaterialStateProperty.all(const BorderSide(
                        color: Colors.blue,
                        width: 2.0,
                        style: BorderStyle.solid))),
                segments: const [
                  ButtonSegment(
                    value: Epreuve.precision,
                    label: Text('P'),
                  ),
                  ButtonSegment(
                    value: Epreuve.biathlon,
                    label: Text('B'),
                  ),
                  ButtonSegment(
                    value: Epreuve.superBiathlon,
                    label: Text('SB'),
                  ),
                  ButtonSegment(
                    value: Epreuve.combine,
                    label: Text('C'),
                  ),
                ],
                selected: selection,
                onSelectionChanged: (Set<Epreuve> newSelection) {
                  setState(() {
                    selection = newSelection;
                  });
                },
              ),
            )
          ],
        ));
  }
}
