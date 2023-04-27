import java.awt.{BorderLayout, Color, Font, GridLayout}
import javax.swing.{BorderFactory, JFrame, JLabel, JPanel, JTextField, SwingConstants}

class Sudoku extends BoardGame {
  var board: JPanel = null

  def drawer(panel: JPanel, frame: JFrame): Unit = {
    board = new JPanel()
    board.setLayout(new GridLayout(rows, cols))
    for (_ <- 1 to rows * cols) {
      val jLabel = new JLabel("", SwingConstants.CENTER)
      jLabel.setBorder(BorderFactory.createLineBorder(Color.BLACK, 5))
      jLabel.setFont(new Font(Font.DIALOG, Font.BOLD, 75))
      board.add(jLabel)
    }
    frame.add(horizontalIndex.jPanel, BorderLayout.NORTH)
    panel.add(horizontalIndex.copy().jPanel, 0)
    frame.add(verticalIndex.jPanel, BorderLayout.WEST)
    frame.add(verticalIndex.copy().jPanel, BorderLayout.EAST)
    frame.add(board, BorderLayout.CENTER)
    frame.revalidate()
  }

  def controller(textField: JTextField, frame: JFrame): Unit = {
    val input = textField.getText
    if (
      input.length() != 4
        || !horizontalIndex.range.contains(input.charAt(0))
        || !verticalIndex.range.contains(input.charAt(1) - 48)
        || input.charAt(2) != ' '
        || !verticalIndex.range.contains(input.charAt(3) - 48)
    ) {
      return
    }

    val index: Int =
      cols * ((rows - 1) - (input.charAt(1) - 49)) + (input.charAt(0) - 65)
    if (board.getComponent(index).asInstanceOf[JLabel].getText != "")
      return

    board
      .getComponent(index)
      .asInstanceOf[JLabel]
      .setText(input.charAt(3).toString)
    textField.setText("")
  }

  override var rows: Int = 9
  override var cols: Int = 9
  horizontalIndex = new HorizontalIndex(cols)
  verticalIndex = new VerticalIndex(rows)
}